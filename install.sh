#!/bin/bash

echo "================================"
echo "School Equipment Lending Portal"
echo "Installation Script"
echo "================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✓ Node.js detected: $(node --version)${NC}"
echo ""

# Install dependencies
echo -e "${YELLOW}Installing npm dependencies...${NC}"
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Dependencies installed successfully${NC}"
else
    echo -e "${RED}✗ Failed to install dependencies${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}Checking environment configuration...${NC}"

# Check for .env.local file
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}Creating .env.local file...${NC}"
    cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:8000
EOF
    echo -e "${GREEN}✓ .env.local created${NC}"
else
    echo -e "${GREEN}✓ .env.local already exists${NC}"
fi

echo ""
echo -e "${GREEN}================================"
echo "Installation Complete!"
echo "================================${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Start the backend: python manage.py runserver 8000"
echo "2. Run the frontend: npm run dev"
echo "3. Visit http://localhost:3000 in your browser"
echo ""
echo -e "${YELLOW}Demo Credentials:${NC}"
echo "Student - Username: john_student, Password: secure123"
echo "Staff - Username: staff_user, Password: staff123"
echo ""
