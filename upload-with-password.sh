#!/bin/bash
# FlowCraft Upload auf Hetzner mit SSH-Passwort

echo "🚀 FLOWCRAFT UPLOAD MIT SSH-PASSWORT"
echo "===================================="
echo ""

SERVER="automat.owona.de"
USER="root"
PASSWORD="LpXqTEPurwUu"

echo "📦 Upload: flowcraft-hetzner.tar.gz (2.6MB)"
echo "🎯 Ziel: $USER@$SERVER:/var/www/"
echo ""

# sshpass für Passwort-basierte Authentifizierung
if command -v sshpass >/dev/null 2>&1; then
    echo "✅ Verwende sshpass für Upload..."
    sshpass -p "$PASSWORD" scp flowcraft-hetzner.tar.gz $USER@$SERVER:/var/www/
else
    echo "⚠️  sshpass nicht verfügbar - interaktiver Upload:"
    echo "   Passwort: $PASSWORD"
    echo ""
    scp flowcraft-hetzner.tar.gz $USER@$SERVER:/var/www/
fi

echo ""
echo "✅ Upload abgeschlossen!"
echo ""
echo "🔧 Nächster Schritt: SSH-Verbindung für Installation"
echo "ssh $USER@$SERVER"
echo "Passwort: $PASSWORD"
