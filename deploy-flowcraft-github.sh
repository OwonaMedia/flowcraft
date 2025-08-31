#!/bin/bash
# FlowCraft GitHub Deployment - Finale Lösung

echo "🚀 FLOWCRAFT GITHUB DEPLOYMENT"
echo "==============================="

# 1. GitHub Repository erstellen (via GitHub CLI wenn authentifiziert)
echo "1️⃣ GitHub Repository erstellen..."
gh repo create flowcraft --private --source . --push 2>/dev/null || {
    echo "⚠️  GitHub CLI nicht authentifiziert."
    echo "📋 Manuell erstellen:"
    echo "   1. Gehen Sie zu: https://github.com/new"
    echo "   2. Repository Name: flowcraft"
    echo "   3. Owner: OwonaMedia"
    echo "   4. Private ✅"
    echo "   5. Nicht 'Initialize with README'"
    echo ""
    read -p "Drücken Sie Enter, wenn Repository erstellt ist..."
    
    # Push nach manueller Erstellung
    git push -u origin main
}

if [ $? -eq 0 ]; then
    echo "✅ FlowCraft auf GitHub gepusht!"
    
    # 2. Server Installation Script erstellen
    echo ""
    echo "2️⃣ Server-Installation Script erstellen..."
    
    cat > flowcraft-server-install.sh << 'EOF'
#!/bin/bash
# FlowCraft Server Installation

echo "🚀 FLOWCRAFT SERVER INSTALLATION"
echo "================================="

# FlowCraft von GitHub clonen
cd /var/www
rm -rf flowcraft 2>/dev/null
git clone git@github.com:OwonaMedia/flowcraft.git flowcraft
cd flowcraft

# Production Environment
echo "⚙️ Environment Setup..."
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

# Installation
echo "📦 Dependencies & Build..."
npm ci --production
npm run build

# Prisma Setup
echo "🗄️ Database Setup..."
npx prisma generate
npx prisma db push

# PM2 Setup
echo "🚀 Process Manager..."
npm install -g pm2 2>/dev/null
pm2 delete flowcraft 2>/dev/null
pm2 start npm --name "flowcraft" -- start
pm2 startup
pm2 save

# Status
echo ""
echo "✅ INSTALLATION ABGESCHLOSSEN!"
echo "📊 Status:"
pm2 status
echo ""
echo "🌐 Test:"
curl -I http://localhost:3000
echo ""
echo "🎉 FlowCraft läuft auf automat.owona.de:3000"
EOF

    chmod +x flowcraft-server-install.sh
    
    echo "✅ Server-Installation Script erstellt: flowcraft-server-install.sh"
    echo ""
    echo "3️⃣ NÄCHSTE SCHRITTE:"
    echo "======================================"
    echo ""
    echo "🔧 SERVER-INSTALLATION:"
    echo "scp flowcraft-server-install.sh root@automat.owona.de:/root/"
    echo "ssh root@automat.owona.de 'bash /root/flowcraft-server-install.sh'"
    echo ""
    echo "🎯 ODER MANUELL:"
    echo "ssh root@automat.owona.de"
    echo "cd /var/www"
    echo "git clone git@github.com:OwonaMedia/flowcraft.git flowcraft"
    echo "# Dann Befehle aus flowcraft-server-install.sh ausführen"
    echo ""
    echo "✨ ERGEBNIS:"
    echo "FlowCraft läuft auf automat.owona.de:3000 mit Supabase Backend!"
    
else
    echo "❌ GitHub Push fehlgeschlagen."
    echo "Prüfen Sie GitHub-Verbindung und Repository-Erstellung."
fi
