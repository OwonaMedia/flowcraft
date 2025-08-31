#!/bin/bash
# FlowCraft Upload - Korrekte Goneo FTP Implementation
# Basierend auf: https://www.goneo.de/hilfe/webhosting/ftp

echo "🚀 FlowCraft Upload - Goneo-konforme Version"
echo "📖 Basierend auf: https://www.goneo.de/hilfe/webhosting/ftp"
echo ""

# Benutzer muss den Servernamen aus dem Kundencenter eingeben
echo "🔧 WICHTIG: Sie benötigen Ihren Servernamen aus dem Goneo-Kundencenter!"
echo "📍 Login: https://www.goneo.de/"
echo "📋 Gehen Sie zu: Webserver → FTP & SSH"
echo "📝 Notieren Sie sich den 'Servernamen' (z.B. web123.goneo.de)"
echo ""

read -p "🌐 Bitte geben Sie Ihren Servernamen ein (aus Kundencenter): " SERVER_NAME

if [ -z "$SERVER_NAME" ]; then
    echo "❌ Kein Servername eingegeben!"
    echo "💡 Öffnen Sie das Goneo-Kundencenter und holen Sie den Servernamen"
    exit 1
fi

echo "📡 Verwende Server: ${SERVER_NAME}"
echo "🔐 Verwende FTPS (explizit) auf Port 21"

# FTP Configuration
FTP_USER="163544f130388"
FTP_PASS="Afidi2008!"

# Create lftp script with correct Goneo settings
cat > lftp_goneo.txt << EOF
set ssl:verify-certificate no
set ftp:ssl-force true
set ftp:ssl-protect-data true
set net:timeout 30
set net:max-retries 3
open ${SERVER_NAME}
user ${FTP_USER} ${FTP_PASS}
lcd .
pwd
ls
mkdir flowcraft
cd flowcraft
mirror -R --verbose --only-newer --exclude-glob=*.sh --exclude-glob=*.txt ./ ./
bye
EOF

echo "🔄 Starte Upload..."
echo "📁 Zielverzeichnis: /flowcraft/"

lftp -f lftp_goneo.txt

if [ $? -eq 0 ]; then
    echo "✅ Upload erfolgreich abgeschlossen!"
    echo ""
    echo "🎉 FlowCraft ist deployed!"
    echo "🌐 URL: https://flowcraft.owona.de"
    echo ""
    echo "📋 Nächste Schritte:"
    echo "1. ⏱️  DNS-Propagation abwarten (5-15 Min)"
    echo "2. 🔧 Environment Variables konfigurieren (.env.local)"
    echo "3. 🧪 Live-Test durchführen"
    echo ""
    echo "🔧 Environment Variables Setup:"
    echo "   - Loggen Sie sich per FTP ein"
    echo "   - Benennen Sie .env.template in .env.local um"
    echo "   - Fügen Sie Production-Keys hinzu"
else
    echo "❌ Upload fehlgeschlagen!"
    echo ""
    echo "💡 Alternative: Manueller Upload mit FileZilla"
    echo "📋 Verwenden Sie diese Daten:"
    echo "   Server: ${SERVER_NAME}"
    echo "   Protokoll: FTPS (explizit)"
    echo "   Port: 21"
    echo "   User: ${FTP_USER}"
    echo "   Passwort: ${FTP_PASS}"
fi

# Cleanup
rm -f lftp_goneo.txt

echo ""
echo "📖 Referenz: https://www.goneo.de/hilfe/webhosting/ftp"
echo "🎯 Upload-Prozess beendet."
