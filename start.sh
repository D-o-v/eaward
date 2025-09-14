#!/bin/bash

echo "Starting ELOY Awards Nominator..."

# Check if virtual environment exists
if [ -d ".venv" ]; then
    PYTHON_CMD="./.venv/bin/python"
    PIP_CMD="./.venv/bin/pip"
else
    PYTHON_CMD="python3"
    PIP_CMD="pip3"
fi

# Install Python dependencies
echo "Installing Python dependencies..."
$PIP_CMD install -r requirements.txt

# Install Node dependencies
echo "Installing Node dependencies..."
npm install

# Start Flask backend in background
echo "Starting Flask backend..."
$PYTHON_CMD app.py &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start React frontend
echo "Starting React frontend..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "=================================================="
echo "ELOY Awards Nominator is running!"
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo "Press Ctrl+C to stop both servers"
echo "=================================================="
echo ""

# Wait for user interrupt
trap "echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait