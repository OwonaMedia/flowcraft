#!/bin/bash
# Upload der statischen FlowCraft-Dateien

echo "🚀 FlowCraft Statischer Upload gestartet..."

FTP_SERVER="owona.de"
FTP_USER="163544f130388"
FTP_PASS="Afidi2008!"

cat > lftp_static.txt << EOF
set ssl:verify-certificate no
set ftp:ssl-force true
set ftp:ssl-protect-data true
set net:timeout 60
open ${FTP_SERVER}
user ${FTP_USER} ${FTP_PASS}

# Navigate to flowcraft directory
cd htdocs/flowcraft

# Remove old files first
rm -rf *

# Upload static export
lcd out
mirror -R --verbose --only-newer ./ ./

# List uploaded files
ls -la
pwd
quit
EOF

echo "📁 Upload statischer Dateien aus out/ Verzeichnis..."
lftp -f lftp_static.txt

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 STATISCHER UPLOAD ERFOLGREICH!"
    echo "✅ FlowCraft updated auf: https://owona.de/flowcraft/"
    echo ""
    echo "🧪 Test durchführen:"
    curl -s -I https://owona.de/flowcraft/ | head -5
else
    echo "❌ Upload fehlgeschlagen"
fi

rm -f lftp_static.txt
echo "🎯 Upload beendet."
