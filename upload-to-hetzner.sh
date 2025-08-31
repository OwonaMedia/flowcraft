#!/bin/bash
# Upload FlowCraft auf automat.owona.de (Hetzner)

echo "📦 FLOWCRAFT UPLOAD AUF HETZNER"
echo "==============================="
echo ""

SERVER="automat.owona.de"
USER="root"
# Passwort wird via SSH-Key oder interaktiv eingegeben

echo "🚀 Uploading FlowCraft (11MB) auf $SERVER..."
echo ""

# Erstelle TAR-Archive für effizienten Upload
cd deployment-hetzner
tar -czf ../flowcraft-deployment.tar.gz .
cd ..

echo "📁 Archive erstellt: flowcraft-deployment.tar.gz"
du -sh flowcraft-deployment.tar.gz

echo ""
echo "⬆️  Starting Upload..."

# Upload via SCP
scp flowcraft-deployment.tar.gz $USER@$SERVER:/root/

echo ""
echo "✅ Upload abgeschlossen!"
echo ""
echo "🔧 Nächste Schritte:"
echo "   1. SSH-Verbindung zu $SERVER"
echo "   2. Archive entpacken"
echo "   3. FlowCraft installieren und starten"
echo "   4. Port 3000 für FlowCraft freigeben"
