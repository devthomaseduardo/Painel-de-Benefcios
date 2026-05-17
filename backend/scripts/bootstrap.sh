#!/bin/bash

# Enterprise SaaS Backend Bootstrap Script
# This script stabilizes the environment, fixes authentication, and regenerates types.

echo "🚀 Starting Enterprise Backend Stabilization..."

# 1. Stop and Clean Containers
echo "🧹 Cleaning Docker environment..."
docker-compose down -v

# 2. Restart Containers (Fresh Start)
echo "📦 Starting Database and Redis..."
docker-compose up -d postgres redis

# 3. Wait for Database to be ready
echo "⏳ Waiting for PostgreSQL to initialize..."
until docker-compose exec -T postgres pg_isready -U user; do
  sleep 1
done
echo "✅ Database is ready!"

# 4. Sync Prisma Schema and Push to DB
echo "🏗️ Synchronizing Prisma schema..."
npx prisma db push --accept-data-loss

# 5. Generate Prisma Client (Fixes stale types)
echo "⚙️ Regenerating Prisma Client..."
npx prisma generate

# 6. Seed the Database
echo "🌱 Seeding initial Enterprise data..."
npx prisma db seed

echo "✨ Backend is ready for development!"
echo "Run 'npm run dev' to start the server."
