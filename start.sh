#!/bin/bash

echo "🍜 ========================================"
echo "   JOTO RAMEN - Starting Server"
echo "🍜 ========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Start the server
echo "🚀 Starting server..."
echo ""
node server.js

echo "🍜 ========================================"
echo "   JOTO RAMEN - Server Closed"
echo "🍜 ========================================"