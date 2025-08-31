#!/bin/bash
# Server-Bereinigung um Speicherplatz zu schaffen

echo "🧹 Server-Bereinigung gestartet..."

FTP_SERVER="owona.de"
FTP_USER="163544f130388"
FTP_PASS="Afidi2008!"

lftp -c "
set ssl:verify-certificate no
set ftp:ssl-force true
open ${FTP_SERVER}
user ${FTP_USER} ${FTP_PASS}
cd htdocs/flowcraft

# Lösche unnötige große Dateien
rm -rf server/
rm -rf public/
rm *.py
rm *.md
rm package.json
rm .env.template

# Prüfe verfügbaren Platz
ls -la

quit
"

echo "✅ Server bereinigt!"
