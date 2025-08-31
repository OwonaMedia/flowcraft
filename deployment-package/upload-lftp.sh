#!/bin/bash
# FlowCraft LFTP Upload Script
# Robust FTP upload with SSL/TLS support

echo "🚀 FlowCraft LFTP Upload gestartet..."

# FTP Configuration
FTP_HOST="ftp.goneo.de"
FTP_USER="163544f130388"
FTP_PASS="Afidi2008!"
REMOTE_DIR="/flowcraft"

# Create lftp script
cat > lftp_upload.txt << 'EOF'
set ssl:verify-certificate no
set ftp:ssl-force true
set ftp:ssl-protect-data true
open ftp.goneo.de
user 163544f130388 Afidi2008!
lcd .
mkdir flowcraft
cd flowcraft
mirror -R --verbose --only-newer ./ ./
bye
EOF

echo "📡 Verbinde zu ${FTP_HOST} mit FTPS..."
echo "📁 Upload zu ${REMOTE_DIR}..."

# Execute lftp with the script
lftp -f lftp_upload.txt

if [ $? -eq 0 ]; then
    echo "✅ Upload erfolgreich abgeschlossen!"
    echo "🌐 FlowCraft sollte verfügbar sein unter:"
    echo "   https://flowcraft.owona.de"
    echo ""
    echo "📋 Nächste Schritte:"
    echo "1. DNS-Propagation abwarten (5-15 Min)"
    echo "2. Environment Variables konfigurieren"
    echo "3. Live-Test durchführen"
else
    echo "❌ Upload fehlgeschlagen!"
    echo "💡 Versuche manuellen Upload mit FileZilla"
fi

# Cleanup
rm -f lftp_upload.txt

echo "🎯 Upload-Prozess beendet."
