# 🚀 FLOWCRAFT GITHUB SETUP

## 📋 SCHRITT-FÜR-SCHRITT GITHUB DEPLOYMENT

### 1️⃣ GITHUB REPOSITORY ERSTELLEN:

1. Gehen Sie zu: https://github.com/new
2. Repository Name: `botchat-pro` oder `flowcraft`
3. Beschreibung: "FlowCraft - WhatsApp Bot SaaS Platform (Next.js 15 + Supabase)"
4. Visibility: **Private** (empfohlen für Production)
5. **NICHT** "Initialize with README" ankreuzen
6. Klicken Sie "Create repository"

### 2️⃣ LOKALES PROJEKT MIT GITHUB VERBINDEN:

```bash
# Im botchat-pro Verzeichnis:
git remote add origin https://github.com/IHR-USERNAME/botchat-pro.git
git branch -M main
git push -u origin main
```

### 3️⃣ SERVER-INSTALLATION (ULTRA-EINFACH):

```bash
# SSH zum Hetzner-Server
ssh root@automat.owona.de
# Passwort: LpXqTEPurwUu

# FlowCraft von GitHub clonen
cd /var/www
git clone https://github.com/IHR-USERNAME/botchat-pro.git flowcraft
cd flowcraft

# Production Environment erstellen
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

# Dependencies & Build
npm ci --production
npm run build

# Prisma Setup
npx prisma generate
npx prisma db push

# PM2 Start
npm install -g pm2
pm2 start npm --name "flowcraft" -- start
pm2 startup
pm2 save

# Status prüfen
pm2 status
curl -I http://localhost:3000
```

## ✅ VORTEILE DIESER METHODE:

- 🚀 **Einfach**: Ein `git clone` statt komplexer Uploads
- 🔄 **Updates**: `git pull && npm run build && pm2 restart flowcraft`
- 📱 **Mobile**: Von überall deploybar
- 🔒 **Sicher**: Private Repository
- 📚 **Versioniert**: Vollständige Git-History

## 🎯 ERGEBNIS:

Nach der Installation läuft **FlowCraft mit vollständiger Supabase-Backend-Integration** auf:
- `automat.owona.de:3000`

**Registrierung und Login funktionieren sofort!** ✨

## 🔄 ZUKÜNFTIGE UPDATES:

```bash
# Auf dem Server:
cd /var/www/flowcraft
git pull
npm ci
npm run build
pm2 restart flowcraft
```

**Das ist die professionellste und einfachste Deployment-Methode!** 🏆
