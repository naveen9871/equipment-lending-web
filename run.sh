#!/bin/bash

echo "Starting School Equipment Lending Portal..."
echo ""

# Check if backend is running
echo "Checking backend..."
if curl -s http://localhost:8000/api/token/ > /dev/null 2>&1; then
    echo "✓ Backend is running"
else
    echo "⚠ Backend is not running at http://localhost:8000"
    echo "Start it with: python manage.py runserver 8000"
    echo ""
fi

# Start development server
echo "Starting frontend development server..."
npm run dev
