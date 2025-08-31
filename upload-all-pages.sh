#!/bin/bash
# Upload aller FlowCraft-Seiten mit funktionierenden Links

echo "🚀 Upload aller FlowCraft-Seiten..."

FTP_SERVER="owona.de"
FTP_USER="163544f130388"
FTP_PASS="Afidi2008!"

lftp -c "
set ssl:verify-certificate no
set ftp:ssl-force true
open ${FTP_SERVER}
user ${FTP_USER} ${FTP_PASS}
cd htdocs/flowcraft

# Upload aktualisierte Hauptseite
put flowcraft-inline.html
mv flowcraft-inline.html index.html

# Erstelle Unterverzeichnisse
mkdir demo
mkdir signup  
mkdir signin

# Upload Demo-Seite
lcd .
put demo-page.html
mv demo-page.html demo/index.html

# Upload Signup-Seite
put signup-page.html
mv signup-page.html signup/index.html

# Upload Signin-Seite
put signin-page.html
mv signin-page.html signin/index.html

# Prüfe Struktur
ls -la
ls -la demo/
ls -la signup/
ls -la signin/

quit
"

echo "✅ Alle Seiten hochgeladen!"
echo ""
echo "🔗 Verfügbare Links:"
echo "   🏠 Hauptseite: https://owona.de/flowcraft/"
echo "   🎮 Demo: https://owona.de/flowcraft/demo/"
echo "   📝 Registrierung: https://owona.de/flowcraft/signup/"
echo "   🔑 Anmeldung: https://owona.de/flowcraft/signin/"
