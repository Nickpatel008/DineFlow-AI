#!/bin/bash

# Database setup script for DineFlow AI

echo "🔧 Setting up DineFlow AI Database..."

# Check if database exists
DB_NAME="dineflow"
DB_USER="${DB_USER:-postgres}"

echo "Creating database if it doesn't exist..."
psql -U $DB_USER -c "CREATE DATABASE $DB_NAME;" 2>/dev/null || echo "Database may already exist or connection failed"

echo "Running Prisma migrations..."
npx prisma migrate dev --name init

echo "Generating Prisma Client..."
npx prisma generate

echo "✅ Database setup complete!"
echo ""
echo "Next steps:"
echo "1. Update server/.env with your PostgreSQL credentials"
echo "2. Create an admin user (see SETUP.md)"
echo "3. Start the server: npm run dev"















