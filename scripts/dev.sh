#!/bin/bash

# Development startup script for Acquisition App with Neon Local
# This script starts the application in development mode with Neon Local

echo " Starting Acquisition App in Development Mode"
echo "================================================"

# Check if .env.development exists
if [ ! -f .env.development ]; then
    echo "❌ Error: .env.development file not found!"
    echo "   Please copy .env.development from the template and update with your Neon credentials."
    exit 1
fi

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "❌ Error: Docker is not running!"
    echo "   Please start Docker Desktop and try again."
    exit 1
fi

# Create .neon_local directory if it doesn't exist
mkdir -p .neon_local

# Add .neon_local to .gitignore if not already present
if ! grep -q ".neon_local/" .gitignore 2>/dev/null; then
    echo ".neon_local/" >> .gitignore
    echo "✅ Added .neon_local/ to .gitignore"
fi

echo " Building and starting development containers..."
echo "   - Neon Local proxy will create an ephemeral database branch"
echo "   - Application will run with hot reload enabled"
echo ""

# Start services in the background first (for migrations to run reliably)
docker compose -f docker-compose.dev.yml up --build -d

# Basic wait for services
echo " Waiting for services to be ready..."
sleep 5

# Run migrations inside the app container (uses .env.development via env_file)
echo "Applying latest schema with Drizzle (inside container)..."
docker compose -f docker-compose.dev.yml exec app npm run db:migrate || {
    echo "❌ Migration failed. Showing recent app logs:";
    docker compose -f docker-compose.dev.yml logs --tail=200 app;
    exit 1;
}

# Bring logs to the foreground
echo "📡 Attaching to containers (Ctrl+C to detach)"
docker compose -f docker-compose.dev.yml logs -f

echo ""
echo "🎉 Development environment started!"
echo "   Application: http://localhost:3000"
echo "   Database (inside compose): postgres://neon:npg@neon-local:5432/${NEON_DATABASE:-appdb}?sslmode=require"
echo ""
echo "To stop the environment, press Ctrl+C or run: docker compose down"