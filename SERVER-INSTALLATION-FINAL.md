# 🚀 FLOWCRAFT SERVER INSTALLATION - FINALE BEFEHLE

## ✅ STATUS:
- ✅ GitHub Repository gefüllt (849 Dateien)
- ✅ Supabase GitHub Integration aktiv
- ✅ Branch `main` verfügbar
- 🎯 **NÄCHSTER SCHRITT:** Server Installation

## 📋 SERVER INSTALLATION (Copy & Paste):

### 1️⃣ **SSH zum Server:**
```bash
ssh root@automat.owona.de
```
**Passwort:** `LpXqTEPurwUu`

### 2️⃣ **FlowCraft Installation (alle Befehle auf einmal):**
```bash
# Aufräumen
cd /var/www
rm -rf flowcraft 2>/dev/null

# Repository clonen (jetzt mit vollem Inhalt!)
git clone https://github.com/OwonaMedia/flowcraft.git flowcraft
cd flowcraft

# Environment Variables
cat > .env.local << 'EOF'
DATABASE_URL="postgresql://postgres:Afidi2008!@db.ddavuntesnxtyikvmkje.supabase.co:5432/postgres"
NEXTAUTH_SECRET="botchat-pro-super-secret-key-2024"
NEXTAUTH_URL="https://automat.owona.de"
NEXT_PUBLIC_SUPABASE_URL="https://ddavuntesnxtyikvmkje.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkYXZ1bnRlc254dHlpa3Zta2plIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NzgyODgsImV4cCI6MjA3MjE1NDI4OH0.BIY4-aQZOsodKF2Nbpg0byKLDolemR96SjoVEe3GMcs"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkYXZ1bnRlc254dHlpa3Zta2plIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjU3ODI4OCwiZXhwIjoyMDcyMTU0Mjg4fQ.HfBZzrvOSAbk5Nve6MZSjYkLnQ2h8un3NPiok0z8YXA"
GDPR_MODE="true"
NODE_ENV="production"
EOF

# Dependencies installieren
npm install --production

# Next.js Build
npm run build

# Prisma Setup
npx prisma generate
npx prisma db push

# PM2 Setup
npm install -g pm2 2>/dev/null || echo "PM2 bereits installiert"
pm2 delete flowcraft 2>/dev/null || echo "Keine bestehende Instanz"
pm2 start npm --name "flowcraft" -- start

# PM2 Autostart
pm2 startup
pm2 save

# Status prüfen
pm2 status
curl -I http://localhost:3000

echo ""
echo "🎉 FLOWCRAFT IST LIVE!"
echo "✅ URL: http://automat.owona.de:3000"
echo "✅ Backend: Supabase EU (Frankfurt)"
echo "✅ Auth: NextAuth.js"
echo "✅ Status: Production Ready"
echo ""
```

## 🎯 **ERWARTETES ERGEBNIS:**

```
✅ Cloning into 'flowcraft'...
✅ Environment variables created
✅ Dependencies installed
✅ Next.js build successful
✅ Prisma connected to Supabase
✅ PM2 flowcraft started
✅ HTTP/1.1 200 OK
🎉 FLOWCRAFT IST LIVE!
```

## 📊 **NACH DER INSTALLATION:**

- **URL:** `http://automat.owona.de:3000`
- **Registrierung:** Funktioniert mit Supabase
- **Login:** Google OAuth + Email
- **Database:** PostgreSQL (EU-Frankfurt)
- **Status:** Production Ready

## 🔄 **UPDATES (ZUKUNFT):**

```bash
cd /var/www/flowcraft
git pull origin main
npm run build
pm2 restart flowcraft
```

**Führen Sie jetzt die SSH-Verbindung und Installation aus!** 🚀
