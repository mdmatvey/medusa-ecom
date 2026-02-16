#!/bin/bash

# Megobari Tea Shop - Stop All Services Script

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${YELLOW}Stopping Megobari Tea Shop services...${NC}"

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Stop backend (npm dev process)
echo -e "${CYAN}Stopping backend...${NC}"
pkill -f "medusa develop" || true
pkill -f "node.*medusa" || true

# Stop storefront (Next.js dev process)
echo -e "${CYAN}Stopping storefront...${NC}"
pkill -f "next dev.*8000" || true
lsof -ti:8000 | xargs kill -9 2>/dev/null || true

# Stop PostgreSQL container
echo -e "${CYAN}Stopping PostgreSQL...${NC}"
cd "$SCRIPT_DIR/backend"
npm run docker:down 2>/dev/null || true

# Clean up log files
rm -f "$SCRIPT_DIR/.backend.log" "$SCRIPT_DIR/.storefront.log" 2>/dev/null || true

echo -e "${GREEN}✓ All services stopped${NC}"
