#!/bin/bash
# Einfacher Upload der inline CSS Version

echo "🎨 FlowCraft Inline-Version Upload..."

FTP_SERVER="owona.de"
FTP_USER="163544f130388"
FTP_PASS="Afidi2008!"

# Simple FTP upload
lftp -c "
set ssl:verify-certificate no
set ftp:ssl-force true
open ${FTP_SERVER}
user ${FTP_USER} ${FTP_PASS}
cd htdocs/flowcraft
put flowcraft-inline.html
mv flowcraft-inline.html index.html
ls -la
quit
"

echo "✅ Upload abgeschlossen!"
echo "🌐 Test: https://owona.de/flowcraft/"
