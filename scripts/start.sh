#!/bin/bash

echo "Starting Delays On Time application..."

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

check_error() {
    if [ $? -ne 0 ]; then
        echo -e "${RED} Error: $1${NC}"
        exit 1
    fi
}

echo -e "${YELLOW} Setting up Python environment...${NC}"
uv sync
check_error "Failed to sync Python environment"

echo -e "${YELLOW}  Setting up database...${NC}"
rm -f src/app/db/hackyeah.db 2>/dev/null
mkdir -p src/app/db
sqlite3 src/app/db/hackyeah.db ".read src/app/db/db_init.sql" ".read src/app/db/seed_db.sql"
check_error "Failed to setup database"

if [ -d "frontend" ]; then
    echo -e "${YELLOW} Setting up frontend...${NC}"
    cd frontend
    npm install
    check_error "Failed to install frontend dependencies"
    cd ..
fi

echo -e "${YELLOW} Starting backend...${NC}"
source .venv/bin/activate
uvicorn src.app.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

sleep 3

if [ -d "frontend" ]; then
    echo -e "${YELLOW} Starting frontend...${NC}"
    cd frontend
    ng serve --host 0.0.0.0 --port 4200 &
    FRONTEND_PID=$!
    cd ..

    echo -e "${YELLOW} Waiting for frontend to build...${NC}"
    sleep 5

    echo -e "${YELLOW} Opening browser...${NC}"
    URL="http://localhost:4200"

    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        open "$URL"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        xdg-open "$URL" &>/dev/null &
    elif [[ "$OSTYPE" == "cygwin" || "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
        # Windows
        start "$URL"
    else
        echo -e "${YELLOW}📌 Manual: Open $URL in browser${NC}"
    fi
fi

echo -e "${GREEN} Application started successfully!${NC}"
echo ""
echo -e "${GREEN} URLs:${NC}"
echo -e "   Backend API: http://localhost:8000"
echo -e "   API Docs: http://localhost:8000/docs"
if [ -d "frontend" ]; then
    echo -e "   Frontend: http://localhost:4200"
fi
echo ""
echo -e "${YELLOW} Management:${NC}"
echo -e "   Press Ctrl+C to stop all services"
echo -e "   Backend PID: $BACKEND_PID"
if [ -d "frontend" ]; then
    echo -e "   Frontend PID: $FRONTEND_PID"
fi

cleanup() {
    echo -e "\n${YELLOW} Stopping services...${NC}"
    kill $BACKEND_PID 2>/dev/null
    if [ -d "frontend" ]; then
        kill $FRONTEND_PID 2>/dev/null
    fi
    echo -e "${GREEN} All services stopped${NC}"
    exit 0
}

trap cleanup SIGINT

wait
