#!/bin/bash
# FlowCraft Startup Script für Hetzner

echo "🚀 Starting FlowCraft on Hetzner..."

# Environment laden
export $(cat .env.local | xargs)

# Dependencies installieren
npm ci --production

# Prisma Setup
npx prisma generate
npx prisma db push

# Server starten auf Port 3000
echo "✅ FlowCraft startet auf Port 3000..."
npm start
