#!/bin/bash
# FlowCraft Installation via SSH auf Hetzner-Server

SERVER="automat.owona.de"
USER="root"
PASSWORD="LpXqTEPurwUu"

echo "🚀 FLOWCRAFT INSTALLATION AUF HETZNER"
echo "======================================"
echo ""

# SSH-Befehle für FlowCraft-Installation
SSH_COMMANDS='
echo "📁 FlowCraft-Verzeichnis erstellen..."
mkdir -p /var/www/flowcraft
cd /var/www/flowcraft

echo "📦 Archive entpacken..."
tar -xzf /var/www/flowcraft-hetzner.tar.gz
rm -f /var/www/flowcraft-hetzner.tar.gz

echo "📋 Verzeichnis-Inhalt:"
ls -la

echo "🔧 Node.js Dependencies installieren..."
npm ci --production

echo "🗄️ Prisma Setup..."
npx prisma generate
npx prisma db push

echo "⚙️ PM2 installieren (falls nicht vorhanden)..."
npm install -g pm2 2>/dev/null || echo "PM2 bereits installiert"

echo "🚀 FlowCraft mit PM2 starten..."
pm2 delete flowcraft 2>/dev/null || echo "Keine bestehende FlowCraft-Instanz"
pm2 start npm --name "flowcraft" -- start

echo "💾 PM2 Autostart konfigurieren..."
pm2 startup 2>/dev/null || echo "PM2 Startup bereits konfiguriert"
pm2 save

echo "✅ FlowCraft-Installation abgeschlossen!"
echo ""
echo "📊 Status-Check:"
pm2 status
echo ""
echo "🌐 Test lokaler Port 3000:"
curl -I http://localhost:3000 2>/dev/null || echo "Port 3000 noch nicht erreichbar"
'

echo "🔐 Führe Installation via SSH aus..."
if command -v sshpass >/dev/null 2>&1; then
    sshpass -p "$PASSWORD" ssh $USER@$SERVER "$SSH_COMMANDS"
else
    echo "⚠️  sshpass nicht verfügbar - interaktive SSH:"
    echo "   Passwort: $PASSWORD"
    ssh $USER@$SERVER "$SSH_COMMANDS"
fi

echo ""
echo "✅ Installation abgeschlossen!"
echo ""
echo "🎯 FlowCraft sollte jetzt auf automat.owona.de:3000 laufen"
echo "📋 Nächste Schritte:"
echo "   1. Domain owona.de auf Hetzner-IP umleiten"
echo "   2. Nginx Reverse Proxy konfigurieren"
echo "   3. SSL-Zertifikat einrichten"
