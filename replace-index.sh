#!/bin/bash
# Ersetze index.html direkt

echo "🔄 Index.html ersetzen..."

FTP_SERVER="owona.de"
FTP_USER="163544f130388"
FTP_PASS="Afidi2008!"

lftp -c "
set ssl:verify-certificate no
set ftp:ssl-force true
open ${FTP_SERVER}
user ${FTP_USER} ${FTP_PASS}
cd htdocs/flowcraft

# Lösche die leere index.html
rm index.html

# Upload neue Version
lcd .
put flowcraft-inline.html
mv flowcraft-inline.html index.html

# Prüfe Größe
ls -la index.html

quit
"

echo "✅ Index.html ersetzt!"
