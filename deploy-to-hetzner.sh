#!/bin/bash
# FlowCraft Deployment auf Hetzner-Server (automat.owona.de)
# 100% EU-DSGVO-konform

echo "🚀 FLOWCRAFT HETZNER DEPLOYMENT"
echo "==============================="
echo ""

# 1. Production Environment Setup
echo "1️⃣ PRODUCTION ENVIRONMENT..."
cp env-production.txt .env.local
echo "✅ Production Environment konfiguriert"
echo ""

# 2. Production Build
echo "2️⃣ PRODUCTION BUILD..."
npm run build
echo "✅ Build erfolgreich"
echo ""

# 3. Deployment Package erstellen
echo "3️⃣ DEPLOYMENT PACKAGE..."
rm -rf deployment-hetzner
mkdir -p deployment-hetzner

# Kopiere nur benötigte Dateien
cp -r .next deployment-hetzner/
cp package.json deployment-hetzner/
cp package-lock.json deployment-hetzner/
cp -r prisma deployment-hetzner/
cp env-production.txt deployment-hetzner/.env.local
cp -r public deployment-hetzner/

# Server-Startup Script
cat > deployment-hetzner/start-flowcraft.sh << 'EOF'
#!/bin/bash
# FlowCraft Startup Script für Hetzner

echo "🚀 Starting FlowCraft on Hetzner..."

# Environment laden
export $(cat .env.local | xargs)

# Dependencies installieren
npm ci --production

# Prisma Setup
npx prisma generate
npx prisma db push

# Server starten auf Port 3000
echo "✅ FlowCraft startet auf Port 3000..."
npm start
EOF

chmod +x deployment-hetzner/start-flowcraft.sh

echo "✅ Deployment Package erstellt"
echo ""

# 4. Package-Größe anzeigen
echo "4️⃣ PACKAGE INFO..."
du -sh deployment-hetzner/
echo ""

echo "🎯 BEREIT FÜR SERVER-UPLOAD!"
echo "Nächste Schritte:"
echo "  1. Upload auf automat.owona.de via SCP"
echo "  2. SSH-Verbindung zum Server"
echo "  3. FlowCraft starten"
echo "  4. Domain owona.de umleiten"
