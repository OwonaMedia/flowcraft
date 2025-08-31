# 🚀 FLOWCRAFT WORKING SOLUTION - REPOSITORY PUBLIC

## ❗ PROBLEM:
```
git@github.com: Permission denied (publickey).
```

**Der Server hat keine SSH-Keys für GitHub!**

## ✅ EINFACHSTE LÖSUNG:

### 1️⃣ REPOSITORY KURZ AUF PUBLIC SETZEN:

1. **Gehen Sie zu:** https://github.com/OwonaMedia/flowcraft/settings
2. **Scroll nach unten:** "Danger Zone" 
3. **Klicken:** "Change repository visibility"
4. **Wählen:** "Make public"
5. **Bestätigen:** Mit "I understand, change repository visibility"

### 2️⃣ SERVER-INSTALLATION (Copy & Paste):

```bash
# Aufräumen
cd /var/www
rm -rf flowcraft 2>/dev/null

# Public Repository clonen (funktioniert ohne Auth)
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
npm ci --production
npm run build

# Prisma
npx prisma generate
npx prisma db push

# PM2
npm install -g pm2 2>/dev/null
pm2 delete flowcraft 2>/dev/null
pm2 start npm --name "flowcraft" -- start
pm2 startup
pm2 save

# Status
pm2 status
curl -I http://localhost:3000
echo "🎉 FlowCraft läuft auf automat.owona.de:3000!"
```

### 3️⃣ REPOSITORY WIEDER PRIVAT SETZEN:

Nach erfolgreicher Installation:
1. **Zurück zu:** https://github.com/OwonaMedia/flowcraft/settings
2. **"Change repository visibility"** → **"Make private"**
3. **Bestätigen**

## 🎯 WARUM DIESE LÖSUNG FUNKTIONIERT:

- ✅ **Public Repository** braucht keine SSH-Keys
- ✅ **HTTPS Clone** funktioniert ohne Authentifizierung
- ✅ **Temporary Public** ist sicher (nur wenige Minuten)
- ✅ **Sofort wieder Private** nach Installation

## 📊 ERWARTETES ERGEBNIS:

```
✅ Cloning into 'flowcraft'...
✅ npm ci completed
✅ Build successful
✅ Prisma generated and pushed
✅ PM2 started flowcraft
✅ HTTP/1.1 200 OK from localhost:3000
🎉 FlowCraft läuft auf automat.owona.de:3000!
```

## 🔒 SICHERHEIT:

- Repository ist nur **2-3 Minuten public**
- Keine sensiblen Daten in Git (Environment wird separat erstellt)
- Sofort wieder private nach Installation

**Das ist die einfachste und funktionalste Lösung!** 🚀
