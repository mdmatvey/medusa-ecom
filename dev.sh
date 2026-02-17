#!/bin/bash

# Megobari Tea Shop - Development Startup Script
# Starts backend, database, and storefront with one command

set -e

# Load nvm if available and use Node 20+
if [ -s "$HOME/.nvm/nvm.sh" ]; then
    source "$HOME/.nvm/nvm.sh"
    # Use Node 20 if available
    if nvm ls 20 &> /dev/null; then
        nvm use 20 &> /dev/null || true
    fi
fi

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"
STOREFRONT_DIR="$SCRIPT_DIR/storefront"

# PIDs for cleanup
BACKEND_PID=""
STOREFRONT_PID=""

# Cleanup function
cleanup() {
    echo -e "\n${YELLOW}Shutting down services...${NC}"

    if [ ! -z "$BACKEND_PID" ]; then
        echo -e "${CYAN}Stopping backend (PID: $BACKEND_PID)...${NC}"
        kill -TERM "$BACKEND_PID" 2>/dev/null || true
    fi

    if [ ! -z "$STOREFRONT_PID" ]; then
        echo -e "${CYAN}Stopping storefront (PID: $STOREFRONT_PID)...${NC}"
        kill -TERM "$STOREFRONT_PID" 2>/dev/null || true
    fi

    # Wait a bit for graceful shutdown
    sleep 2

    # Force kill if still running
    if [ ! -z "$BACKEND_PID" ]; then
        kill -9 "$BACKEND_PID" 2>/dev/null || true
    fi
    if [ ! -z "$STOREFRONT_PID" ]; then
        kill -9 "$STOREFRONT_PID" 2>/dev/null || true
    fi

    echo -e "${GREEN}All services stopped.${NC}"
    exit 0
}

# Trap Ctrl+C and other exit signals
trap cleanup SIGINT SIGTERM EXIT

echo -e "${MAGENTA}"
echo "╔════════════════════════════════════════╗"
echo "║   Megobari Tea Shop - Dev Launcher     ║"
echo "╚════════════════════════════════════════╝"
echo -e "${NC}"

# Check if backend directory exists
if [ ! -d "$BACKEND_DIR" ]; then
    echo -e "${RED}Error: Backend directory not found at $BACKEND_DIR${NC}"
    exit 1
fi

# Check if storefront directory exists
if [ ! -d "$STOREFRONT_DIR" ]; then
    echo -e "${RED}Error: Storefront directory not found at $STOREFRONT_DIR${NC}"
    exit 1
fi

# Check if node_modules exist
echo -e "${BLUE}Checking dependencies...${NC}"

if [ ! -d "$BACKEND_DIR/node_modules" ]; then
    echo -e "${YELLOW}Backend dependencies not found. Installing...${NC}"
    cd "$BACKEND_DIR"
    npm install
fi

if [ ! -d "$STOREFRONT_DIR/node_modules" ]; then
    echo -e "${YELLOW}Storefront dependencies not found. Installing...${NC}"
    cd "$STOREFRONT_DIR"
    npm install
fi

# Check if .env exists in backend
if [ ! -f "$BACKEND_DIR/.env" ]; then
    echo -e "${YELLOW}Warning: Backend .env file not found${NC}"
    echo -e "${CYAN}Creating from .env.example if available...${NC}"
    if [ -f "$BACKEND_DIR/.env.example" ]; then
        cp "$BACKEND_DIR/.env.example" "$BACKEND_DIR/.env"
        echo -e "${GREEN}Created backend/.env from .env.example${NC}"
    fi
fi

# Check if .env.local exists in storefront
if [ ! -f "$STOREFRONT_DIR/.env.local" ]; then
    echo -e "${YELLOW}Warning: Storefront .env.local not found${NC}"
    echo -e "${CYAN}Creating default .env.local...${NC}"
    cat > "$STOREFRONT_DIR/.env.local" << 'EOF'
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=
EOF
    echo -e "${GREEN}Created storefront/.env.local${NC}"
    echo -e "${YELLOW}Don't forget to add your NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!${NC}"
fi

# Start PostgreSQL container
echo -e "\n${BLUE}[1/4] Starting PostgreSQL container...${NC}"
cd "$BACKEND_DIR"
npm run docker:up

# Wait for PostgreSQL to be ready
echo -e "${CYAN}Waiting for PostgreSQL to be ready...${NC}"
sleep 3

# Check if database is ready
for i in {1..30}; do
    if podman compose -f "$BACKEND_DIR/docker-compose.dev.yml" exec -T postgres pg_isready -U postgres > /dev/null 2>&1; then
        echo -e "${GREEN}PostgreSQL is ready!${NC}"
        break
    fi
    echo -n "."
    sleep 1
    if [ $i -eq 30 ]; then
        echo -e "\n${RED}PostgreSQL failed to start. Check Podman logs.${NC}"
        exit 1
    fi
done

# Start Medusa backend
echo -e "\n${BLUE}[2/4] Starting Medusa backend...${NC}"
cd "$BACKEND_DIR"
npm run dev > "$SCRIPT_DIR/.backend.log" 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}Backend started (PID: $BACKEND_PID)${NC}"

# Wait for backend to be ready
echo -e "${CYAN}Waiting for backend to be ready...${NC}"
for i in {1..60}; do
    if curl -s http://localhost:9000/health > /dev/null 2>&1; then
        echo -e "${GREEN}Backend is ready!${NC}"
        break
    fi
    echo -n "."
    sleep 2
    if [ $i -eq 60 ]; then
        echo -e "\n${RED}Backend failed to start. Check .backend.log${NC}"
        tail -n 20 "$SCRIPT_DIR/.backend.log"
        exit 1
    fi
done

# Start Next.js storefront
echo -e "\n${BLUE}[3/4] Starting Next.js storefront...${NC}"
cd "$STOREFRONT_DIR"
npm run dev -- --port 8000 > "$SCRIPT_DIR/.storefront.log" 2>&1 &
STOREFRONT_PID=$!
echo -e "${GREEN}Storefront started (PID: $STOREFRONT_PID)${NC}"

# Wait for storefront to be ready
echo -e "${CYAN}Waiting for storefront to be ready...${NC}"
for i in {1..60}; do
    if curl -s http://localhost:8000 > /dev/null 2>&1; then
        echo -e "${GREEN}Storefront is ready!${NC}"
        break
    fi
    echo -n "."
    sleep 2
    if [ $i -eq 60 ]; then
        echo -e "\n${RED}Storefront failed to start. Check .storefront.log${NC}"
        tail -n 20 "$SCRIPT_DIR/.storefront.log"
        exit 1
    fi
done

# All services are ready
echo -e "\n${GREEN}"
echo "╔════════════════════════════════════════╗"
echo "║        All Services Running! 🚀        ║"
echo "╚════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "${CYAN}📍 Service URLs:${NC}"
echo -e "   ${BLUE}Storefront:${NC}     http://localhost:8000"
echo -e "   ${BLUE}Backend API:${NC}    http://localhost:9000"
echo -e "   ${BLUE}Admin Panel:${NC}    http://localhost:9000/app"
echo -e "   ${BLUE}PostgreSQL:${NC}     localhost:5432"

echo -e "\n${CYAN}📊 Logs:${NC}"
echo -e "   ${BLUE}Backend:${NC}        tail -f $SCRIPT_DIR/.backend.log"
echo -e "   ${BLUE}Storefront:${NC}     tail -f $SCRIPT_DIR/.storefront.log"

echo -e "\n${CYAN}🛑 To stop:${NC}"
echo -e "   Press ${YELLOW}Ctrl+C${NC} or run: ${BLUE}npm run dev:stop${NC}"

echo -e "\n${YELLOW}⚠️  Remember to set your NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY in storefront/.env.local${NC}"
echo -e "${CYAN}   Get it from: http://localhost:9000/app → Settings → Publishable API Keys${NC}"

# Keep script running and tail logs
echo -e "\n${MAGENTA}════════════════════════════════════════${NC}"
echo -e "${CYAN}Watching logs (Ctrl+C to stop all services)...${NC}"
echo -e "${MAGENTA}════════════════════════════════════════${NC}\n"

# Tail both logs
tail -f "$SCRIPT_DIR/.backend.log" "$SCRIPT_DIR/.storefront.log" &
TAIL_PID=$!

# Wait for user to press Ctrl+C
wait $TAIL_PID
