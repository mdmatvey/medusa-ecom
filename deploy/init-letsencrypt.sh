#!/bin/bash
# One-time script to get initial Let's Encrypt certificates.
# Run this ONCE on a fresh server before running deploy.sh for the first time.
# Requires: docker (or podman with docker compat), your DNS already pointing to this VM.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

if [ ! -f .env ]; then
  echo "Error: deploy/.env not found."
  echo "Copy .env.example to .env and fill in all values first."
  exit 1
fi

source .env

if [ -z "$DOMAIN" ] || [ -z "$CERTBOT_EMAIL" ]; then
  echo "Error: DOMAIN and CERTBOT_EMAIL must be set in .env"
  exit 1
fi

COMPOSE="docker compose"
command -v docker &>/dev/null || COMPOSE="podman compose"

DOMAINS=("$DOMAIN" "api.$DOMAIN")
DATA_PATH="./nginx/certbot"

echo "=== Initializing Let's Encrypt for: ${DOMAINS[*]} ==="
echo ""

# Check that DNS is resolving to this machine
echo "Checking DNS..."
MY_IP=$(curl -s https://api.ipify.org 2>/dev/null || curl -s https://checkip.amazonaws.com 2>/dev/null || echo "unknown")
for domain in "${DOMAINS[@]}"; do
  RESOLVED=$(dig +short "$domain" 2>/dev/null | tail -1 || echo "")
  if [ "$RESOLVED" != "$MY_IP" ] && [ "$MY_IP" != "unknown" ]; then
    echo "Warning: $domain resolves to '$RESOLVED', but this VM's IP appears to be '$MY_IP'"
    echo "Make sure DNS is pointing to this server before continuing."
    read -p "Continue anyway? (y/N): " confirm
    [[ "$confirm" =~ ^[Yy]$ ]] || exit 1
  fi
done

# Generate the nginx config from template
echo "Generating nginx config..."
sed "s/YOURDOMAIN/$DOMAIN/g" ./nginx/conf.d/app.conf.template > ./nginx/conf.d/app.conf

# Create dummy self-signed certs so nginx can start (it requires certs to boot)
echo "Creating temporary self-signed certificates..."
for domain in "${DOMAINS[@]}"; do
  mkdir -p "$DATA_PATH/conf/live/$domain"
  openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
    -keyout "$DATA_PATH/conf/live/$domain/privkey.pem" \
    -out    "$DATA_PATH/conf/live/$domain/fullchain.pem" \
    -subj "/CN=localhost" 2>/dev/null
done

# Start nginx with dummy certs
echo "Starting nginx..."
$COMPOSE up -d nginx
sleep 3

# Replace dummy certs with real ones
echo ""
echo "Requesting Let's Encrypt certificates..."
for domain in "${DOMAINS[@]}"; do
  rm -rf "$DATA_PATH/conf/live/$domain"
  $COMPOSE run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email "$CERTBOT_EMAIL" \
    --agree-tos \
    --no-eff-email \
    -d "$domain"
done

# Reload nginx with real certs
echo ""
echo "Reloading nginx with real certificates..."
$COMPOSE exec nginx nginx -s reload

echo ""
echo "=== SSL certificates obtained successfully! ==="
echo ""
echo "Next step: run ./deploy.sh to start the full stack."
