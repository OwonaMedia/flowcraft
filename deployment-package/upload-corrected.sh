#!/bin/bash
# FlowCraft Upload Script - Korrigierte Version
# Verwendet goneo.de als FTP-Server

echo "🚀 FlowCraft Upload gestartet (korrigierte Version)..."

# Korrigierte FTP Configuration
FTP_HOST="goneo.de"  # Nicht ftp.goneo.de!
FTP_USER="163544f130388"
FTP_PASS="Afidi2008!"

echo "📡 Verbinde zu ${FTP_HOST}..."

# Test connection first
echo "🔍 Teste FTP-Verbindung..."

cat > lftp_test.txt << 'EOF'
set ssl:verify-certificate no
set ftp:ssl-force false
set ftp:ssl-allow true
open goneo.de
user 163544f130388 Afidi2008!
pwd
ls
bye
EOF

echo "📋 FTP-Verbindungstest:"
lftp -f lftp_test.txt

if [ $? -eq 0 ]; then
    echo "✅ FTP-Verbindung erfolgreich!"
    
    # Actual upload
    echo "🔄 Starte Upload..."
    
    cat > lftp_upload_final.txt << 'EOF'
set ssl:verify-certificate no
set ftp:ssl-force false
set ftp:ssl-allow true
open goneo.de
user 163544f130388 Afidi2008!
lcd .
mkdir flowcraft
cd flowcraft
mirror -R --verbose --only-newer ./ ./
bye
EOF
    
    lftp -f lftp_upload_final.txt
    
    if [ $? -eq 0 ]; then
        echo "🎉 Upload erfolgreich abgeschlossen!"
        echo "🌐 FlowCraft verfügbar unter: https://flowcraft.owona.de"
    else
        echo "❌ Upload fehlgeschlagen"
    fi
    
    rm -f lftp_upload_final.txt
else
    echo "❌ FTP-Verbindung fehlgeschlagen"
    echo "💡 Manueller Upload mit FileZilla empfohlen"
    echo ""
    echo "📋 Korrekte FTP-Daten für FileZilla:"
    echo "   Server: goneo.de (NICHT ftp.goneo.de)"
    echo "   User: 163544f130388"
    echo "   Pass: Afidi2008!"
    echo "   Port: 21 (FTP/FTPS)"
fi

rm -f lftp_test.txt

echo "🎯 Vorgang beendet."
