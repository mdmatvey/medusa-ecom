#!/bin/bash
# Deploy / update the production stack.
# Run after every git pull to rebuild changed images and restart services.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

if [ ! -f .env ]; then
  echo "Error: deploy/.env not found."
  echo "Copy .env.example to .env and fill in all values first."
  exit 1
fi

source .env

COMPOSE="docker compose"
command -v docker &>/dev/null || COMPOSE="podman compose"

echo "=== Deploying Megobari Medusa ==="
echo ""

# Copy nginx config (template has no substitutions needed in HTTP mode)
cp ./nginx/conf.d/app.conf.template ./nginx/conf.d/app.conf

# Pull latest infrastructure images
echo "[1/3] Pulling infrastructure images..."
$COMPOSE pull postgres redis nginx

# Build application images
echo "[2/3] Building application images..."
$COMPOSE build medusa-server medusa-worker storefront

# Start / restart everything
echo "[3/3] Starting services..."
$COMPOSE up -d

echo ""
echo "=== Deployment complete! ==="
echo ""
echo "  Storefront: http://${VM_IP:-<VM_IP>}"
echo "  API:        http://${VM_IP:-<VM_IP>}:9000"
echo "  Admin:      http://${VM_IP:-<VM_IP>}:9000/app"
echo ""
echo "To view logs:    $COMPOSE logs -f"
echo "To check health: $COMPOSE ps"
