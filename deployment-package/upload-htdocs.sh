#!/bin/bash
# FlowCraft Upload ins korrekte htdocs-Verzeichnis

echo "🚀 FlowCraft Upload ins htdocs/flowcraft/ Verzeichnis..."

FTP_SERVER="owona.de"
FTP_USER="163544f130388"
FTP_PASS="Afidi2008!"

# Upload into htdocs directory (correct web root)
cat > lftp_htdocs.txt << EOF
set ssl:verify-certificate no
set ftp:ssl-force true
set ftp:ssl-protect-data true
set net:timeout 60
open ${FTP_SERVER}
user ${FTP_USER} ${FTP_PASS}
lcd .

# Navigate to htdocs (web root)
cd htdocs
pwd
ls

# Create flowcraft subdirectory
mkdir flowcraft
cd flowcraft

# Upload all files and directories
mirror -R --verbose --only-newer --exclude-glob="*.sh" --exclude-glob="*.txt" ./ ./

# List uploaded files
ls -la
pwd
quit
EOF

echo "📁 Upload zu: htdocs/flowcraft/"
lftp -f lftp_htdocs.txt

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 UPLOAD ERFOLGREICH!"
    echo "✅ FlowCraft deployed zu: htdocs/flowcraft/"
    echo "🌐 URL: https://flowcraft.owona.de"
    echo ""
    echo "📋 Verifyier mit:"
    echo "   curl -I https://flowcraft.owona.de"
else
    echo "❌ Upload zu htdocs fehlgeschlagen"
fi

rm -f lftp_htdocs.txt
echo "🎯 Upload-Prozess beendet."
