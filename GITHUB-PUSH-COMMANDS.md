# 🚀 FLOWCRAFT → GITHUB PUSH (SOFORT AUSFÜHREN)

## ⚡ SCHNELLE LÖSUNG:

### 1️⃣ **Lokaler Push (Copy & Paste):**

```bash
git add .
git commit -m "Complete FlowCraft deployment with Supabase integration"
git push -u origin main
```

### 2️⃣ **Server Installation (Copy & Paste):**

```bash
# SSH zum Server
ssh root@automat.owona.de
# Passwort: LpXqTEPurwUu

# Auf dem Server:
cd /var/www
rm -rf flowcraft 2>/dev/null

# Repository clonen (jetzt mit Inhalt!)
git clone https://github.com/OwonaMedia/flowcraft.git flowcraft
cd flowcraft

# Environment
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

# Installation
npm install --production
npm run build

# Prisma
npx prisma generate
npx prisma db push

# PM2 Start
npm install -g pm2 2>/dev/null
pm2 delete flowcraft 2>/dev/null
pm2 start npm --name "flowcraft" -- start
pm2 startup
pm2 save

# Status prüfen
pm2 status
curl -I http://localhost:3000
echo "🎉 FlowCraft läuft auf automat.owona.de:3000!"
```

## 🎯 **WARUM ES JETZT FUNKTIONIERT:**

✅ **Supabase + GitHub verbunden**
✅ **Repository wird mit Inhalt gepusht**
✅ **Server kann komplette App clonen**
✅ **Alle Dependencies und Prisma Schema verfügbar**

## 📊 **ERWARTETES ERGEBNIS:**

```
✅ git push successful
✅ Repository populated with FlowCraft code
✅ Server clone successful
✅ npm install successful
✅ Build successful
✅ Prisma connected to Supabase
✅ PM2 FlowCraft running
✅ HTTP/1.1 200 OK
🎉 FlowCraft LIVE auf automat.owona.de:3000!
```

**FÜHREN SIE JETZT DIE 2 SCHRITTE AUS! 🚀**
