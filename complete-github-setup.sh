#!/bin/bash
# FlowCraft - Automatisches GitHub Setup & Deployment

echo "🚀 FLOWCRAFT GITHUB SETUP & DEPLOYMENT"
echo "======================================="
echo ""

# Repository URL wird vom User bereitgestellt
REPO_URL=""

echo "📋 SETUP-SCHRITTE:"
echo ""
echo "1️⃣ GitHub Repository erstellen:"
echo "   • Gehen Sie zu: https://github.com/new"
echo "   • Repository Name: flowcraft oder botchat-pro"
echo "   • Private Repository (empfohlen)"
echo "   • NICHT 'Initialize with README' ankreuzen"
echo ""

read -p "Geben Sie die Repository-URL ein (z.B. https://github.com/username/flowcraft.git): " REPO_URL

if [ -z "$REPO_URL" ]; then
    echo "❌ Keine Repository-URL eingegeben. Setup abgebrochen."
    exit 1
fi

echo ""
echo "2️⃣ Git Remote konfigurieren..."
git remote remove origin 2>/dev/null || echo "Kein bestehender origin gefunden"
git remote add origin "$REPO_URL"
git branch -M main

echo ""
echo "3️⃣ Push zu GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo "✅ FlowCraft erfolgreich auf GitHub gepusht!"
    echo ""
    echo "4️⃣ Server-Installation Script erstellen..."
    
    # Server-Installation Script erstellen
    cat > server-install.sh << EOF
#!/bin/bash
# FlowCraft Server Installation via GitHub

echo "🚀 FLOWCRAFT SERVER INSTALLATION"
echo "================================="

# Zum Server-Verzeichnis
cd /var/www

# FlowCraft clonen
echo "📦 Clone FlowCraft von GitHub..."
git clone $REPO_URL flowcraft
cd flowcraft

# Production Environment
echo "⚙️ Production Environment erstellen..."
cat > .env.local << 'ENVEOF'
DATABASE_URL="postgresql://postgres:Afidi2008!@db.ddavuntesnxtyikvmkje.supabase.co:5432/postgres"
NEXTAUTH_SECRET="botchat-pro-super-secret-key-2024"
NEXTAUTH_URL="https://automat.owona.de"
NEXT_PUBLIC_SUPABASE_URL="https://ddavuntesnxtyikvmkje.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkYXZ1bnRlc254dHlpa3Zta2plIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NzgyODgsImV4cCI6MjA3MjE1NDI4OH0.BIY4-aQZOsodKF2Nbpg0byKLDolemR96SjoVEe3GMcs"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkYXZ1bnRlc254dHlpa3Zta2plIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjU3ODI4OCwiZXhwIjoyMDcyMTU0Mjg4fQ.HfBZzrvOSAbk5Nve6MZSjYkLnQ2h8un3NPiok0z8YXA"
GDPR_MODE="true"
NODE_ENV="production"
ENVEOF

# Dependencies installieren
echo "📦 Dependencies installieren..."
npm ci --production

# Production Build
echo "🏗️ Production Build..."
npm run build

# Prisma Setup
echo "🗄️ Prisma Setup..."
npx prisma generate
npx prisma db push

# PM2 installieren und starten
echo "🚀 PM2 Setup..."
npm install -g pm2 2>/dev/null || echo "PM2 bereits installiert"
pm2 delete flowcraft 2>/dev/null || echo "Keine bestehende Instanz"
pm2 start npm --name "flowcraft" -- start
pm2 startup
pm2 save

# Status prüfen
echo "✅ Installation abgeschlossen!"
echo ""
echo "📊 Status:"
pm2 status
echo ""
echo "🌐 Test:"
curl -I http://localhost:3000

echo ""
echo "🎉 FlowCraft läuft auf automat.owona.de:3000"
echo "🔧 Für Updates: git pull && npm run build && pm2 restart flowcraft"
EOF

    chmod +x server-install.sh
    
    echo ""
    echo "✅ SETUP ABGESCHLOSSEN!"
    echo ""
    echo "🎯 NÄCHSTE SCHRITTE:"
    echo "1. SSH zum Server: ssh root@automat.owona.de"
    echo "2. Script kopieren und ausführen:"
    echo "   scp server-install.sh root@automat.owona.de:/root/"
    echo "   ssh root@automat.owona.de 'bash /root/server-install.sh'"
    echo ""
    echo "🚀 FlowCraft wird dann auf automat.owona.de:3000 laufen!"
    
else
    echo "❌ GitHub Push fehlgeschlagen. Prüfen Sie Repository-URL und Zugriffsrechte."
fi
EOF

chmod +x complete-github-setup.sh

echo "✅ Automatisches GitHub Setup Script erstellt!"
echo ""
echo "🚀 NÄCHSTER SCHRITT:"
echo "1. Erstellen Sie GitHub Repository: https://github.com/new"
echo "2. Führen Sie aus: ./complete-github-setup.sh"
echo ""
echo "Das Script wird:"
echo "   • Git Remote konfigurieren"
echo "   • FlowCraft auf GitHub pushen"
echo "   • Server-Installation Script erstellen"
echo "   • Deployment automatisieren"
