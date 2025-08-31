#!/bin/bash
# FlowCraft Upload zu owona.de
# Verwendet owona.de als FTP-Server (basierend auf Goneo-Info)

echo "🚀 FlowCraft Upload zu owona.de gestartet..."
echo "📖 Server: owona.de (Ihre Domain als FTP-Server)"

# FTP Configuration
FTP_SERVER="owona.de"  # Ihre Domain als FTP-Server
FTP_USER="163544f130388"
FTP_PASS="Afidi2008!"

echo "📡 Verbinde zu: ${FTP_SERVER}"
echo "🔐 Verwende FTPS (explizit) auf Port 21"

# Test connection first
echo "🔍 Teste FTP-Verbindung..."

cat > lftp_test_owona.txt << EOF
set ssl:verify-certificate no
set ftp:ssl-force true
set ftp:ssl-protect-data true
set net:timeout 30
open ${FTP_SERVER}
user ${FTP_USER} ${FTP_PASS}
pwd
ls
quit
EOF

lftp -f lftp_test_owona.txt

if [ $? -eq 0 ]; then
    echo "✅ FTP-Verbindung zu owona.de erfolgreich!"
    echo ""
    echo "🔄 Starte Upload aller FlowCraft-Dateien..."
    
    # Create upload script
    cat > lftp_upload_owona.txt << EOF
set ssl:verify-certificate no
set ftp:ssl-force true
set ftp:ssl-protect-data true
set net:timeout 60
set net:max-retries 3
open ${FTP_SERVER}
user ${FTP_USER} ${FTP_PASS}
lcd .
pwd

# Create flowcraft directory
mkdir flowcraft
cd flowcraft

# Upload all directories and files
mirror -R --verbose --only-newer --exclude-glob="*.sh" --exclude-glob="*.txt" ./ ./

ls -la
quit
EOF
    
    echo "📁 Upload-Ziel: /flowcraft/ auf owona.de"
    lftp -f lftp_upload_owona.txt
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "🎉 UPLOAD ERFOLGREICH ABGESCHLOSSEN!"
        echo ""
        echo "✅ FlowCraft ist jetzt deployed auf:"
        echo "🌐 https://flowcraft.owona.de"
        echo ""
        echo "📋 NÄCHSTE SCHRITTE:"
        echo "1. ⏱️  DNS-Propagation abwarten (5-15 Minuten)"
        echo "2. 🔧 Environment Variables konfigurieren:"
        echo "   - Per FTP: .env.template → .env.local umbenennen"
        echo "   - Production Keys einfügen (Stripe, WhatsApp, Google)"
        echo "3. 🧪 Live-Test: https://flowcraft.owona.de aufrufen"
        echo ""
        echo "🎯 DEPLOYMENT ERFOLGREICH! 🚀"
    else
        echo "❌ Upload fehlgeschlagen"
        echo "💡 Versuchen Sie manuellen Upload mit FileZilla"
    fi
    
    # Cleanup
    rm -f lftp_upload_owona.txt
else
    echo "❌ FTP-Verbindung zu owona.de fehlgeschlagen"
    echo ""
    echo "💡 Versuchen Sie den alternativen Server:"
    echo "   Server: 610416.test-my-website.de"
    echo "   Oder manueller Upload mit FileZilla"
fi

# Cleanup
rm -f lftp_test_owona.txt

echo ""
echo "🎯 Upload-Prozess beendet."
