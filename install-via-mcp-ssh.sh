#!/bin/bash
# FlowCraft Installation via MCP SSH-Tools

echo "🚀 FLOWCRAFT INSTALLATION VIA MCP SSH-TOOLS"
echo "============================================="
echo ""

echo "📋 VERWENDUNG DER N8N ADVANCED MCP SERVER:"
echo "   • SSH-Tunnel: 11/11 aktiv"
echo "   • Remote n8n MCP-Server auf owona.de"
echo "   • Production-ready mit 525+ Nodes"
echo ""

# MCP SSH-Befehle verwenden
echo "🔧 INSTALLATION COMMANDS FÜR SERVER:"
echo "======================================"

cat << 'EOF'

# 1. Mit MCP SSH-Tools auf Server verbinden und FlowCraft installieren:

# Archive entpacken
cd /var/www
tar -xzf flowcraft-hetzner.tar.gz -C flowcraft/
cd flowcraft

# Node.js Dependencies installieren
npm ci --production

# Prisma Setup
npx prisma generate
npx prisma db push

# PM2 für Prozess-Management
npm install -g pm2 2>/dev/null || echo "PM2 bereits installiert"

# FlowCraft starten
pm2 delete flowcraft 2>/dev/null || echo "Keine bestehende Instanz"
pm2 start npm --name "flowcraft" -- start

# PM2 Autostart
pm2 startup
pm2 save

# Status prüfen
pm2 status
curl -I http://localhost:3000

EOF

echo ""
echo "🎯 NÄCHSTE SCHRITTE:"
echo "1. Verbindung mit MCP SSH-Tools herstellen"
echo "2. Obige Befehle auf dem Server ausführen"
echo "3. FlowCraft läuft dann auf automat.owona.de:3000"
echo "4. Domain owona.de auf Hetzner-Server umleiten"
