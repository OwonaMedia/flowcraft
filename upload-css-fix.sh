#!/bin/bash
# FlowCraft CSS-Fix Upload - Nur kritische Dateien

echo "🎨 FlowCraft CSS-Fix Upload gestartet..."

FTP_SERVER="owona.de"
FTP_USER="163544f130388"
FTP_PASS="Afidi2008!"

# Upload nur die _next Verzeichnisse mit CSS und JS
cat > lftp_css_fix.txt << EOF
set ssl:verify-certificate no
set ftp:ssl-force true
set ftp:ssl-protect-data true
set net:timeout 120
open ${FTP_SERVER}
user ${FTP_USER} ${FTP_PASS}

# Navigate to flowcraft directory
cd htdocs/flowcraft

# Upload _next directory structure
lcd out
mirror -R --verbose --only-newer _next/ _next/

# List uploaded files
ls -la _next/static/chunks/ | head -10

quit
EOF

echo "📁 Upload _next Verzeichnis mit CSS/JS..."
lftp -f lftp_css_fix.txt

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 CSS-FIX UPLOAD ERFOLGREICH!"
    echo "✅ _next Dateien hochgeladen"
    echo ""
    echo "🧪 CSS-Test:"
    curl -I https://owona.de/flowcraft/_next/static/chunks/c9bc6ebf6bac4794.css | head -2
else
    echo "❌ CSS-Upload fehlgeschlagen"
fi

rm -f lftp_css_fix.txt
echo "🎯 CSS-Fix beendet."
