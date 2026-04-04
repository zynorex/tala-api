#!/bin/bash
set -e

echo "🚀 TALA - Trust is Code Setup"
echo "================================"

# Backend setup
echo ""
echo "📦 Setting up backend..."
cd backend

if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "✓ Created .env file"
fi

echo "📥 Installing Go dependencies..."
go mod download

echo "✓ Backend setup complete!"

# Frontend setup
echo ""
echo "🎨 Setting up frontend..."
cd ../frontend

if [ ! -f ".env.local" ]; then
    cp .env.example .env.local
    echo "✓ Created .env.local file"
fi

echo "📥 Installing Node dependencies..."
npm install

echo "✓ Frontend setup complete!"

echo ""
echo "================================"
echo "✅ Setup complete!"
echo ""
echo "To start the project:"
echo "  Backend:  cd backend && go run main.go"
echo "  Frontend: cd frontend && npm run dev"
echo ""
