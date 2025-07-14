#!/bin/bash

set -e

echo "Setting up CustomBooru in DEVELOPMENT mode..."

# Check if master key exists, generate if not
if [ ! -f backend/config/master.key ]; then
    echo "Generating Rails master key..."
    cd backend
    echo $(bundle exec rails secret) > config/master.key
    cd ..
    echo "Master key generated at backend/config/master.key"
fi

# Copy environment file if needed
if [ ! -f .env ]; then
    echo "Creating .env file from example..."
    cp .env.example .env
    MASTER_KEY=$(cat backend/config/master.key)
    sed -i "s/your_rails_master_key_here/$MASTER_KEY/g" .env
    echo "Updated .env with generated master key"
fi

echo "Building Docker containers for development..."
docker-compose -f docker-compose.dev.yml build

echo "Setting up development database..."
docker-compose -f docker-compose.dev.yml run --rm backend bundle exec rails db:create db:migrate

echo "Starting development services..."
docker-compose -f docker-compose.dev.yml up -d

echo ""
echo "✅ CustomBooru DEVELOPMENT is now running!"
echo "📱 Frontend: http://localhost:4173"
echo "🔧 Backend API: http://localhost:3000"
echo ""
echo "Development Commands:"
echo "  Stop: docker-compose -f docker-compose.dev.yml down"
echo "  Logs: docker-compose -f docker-compose.dev.yml logs -f"
echo "  Restart: docker-compose -f docker-compose.dev.yml restart"