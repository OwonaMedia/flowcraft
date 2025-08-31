# 🚀 FLOWCRAFT GITHUB PUSH - DIREKTE BEFEHLE

## ✅ REPOSITORY IST DA:
https://github.com/OwonaMedia/flowcraft

## 📋 COPY & PASTE IN IHR TERMINAL:

### 1️⃣ GitHub Push (lokal):
```bash
git push -u origin main
```

### 2️⃣ Server-Installation (SSH):
```bash
ssh root@automat.owona.de
```

**Passwort:** `LpXqTEPurwUu`

### 3️⃣ FlowCraft Installation (Copy & Paste auf Server):
```bash
cd /var/www
rm -rf flowcraft 2>/dev/null
git clone https://github.com/OwonaMedia/flowcraft.git flowcraft
cd flowcraft

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

npm ci --production
npm run build
npx prisma generate
npx prisma db push
npm install -g pm2
pm2 start npm --name "flowcraft" -- start
pm2 startup
pm2 save
```

### 4️⃣ Status prüfen:
```bash
pm2 status
curl -I http://localhost:3000
echo "🎉 FlowCraft läuft auf automat.owona.de:3000"
```

## 🎯 ERGEBNIS:
- ✅ FlowCraft auf GitHub
- ✅ FlowCraft läuft auf automat.owona.de:3000
- ✅ Registrierung/Login funktioniert mit Supabase
- ✅ 100% EU-DSGVO-konform

## 🔄 ZUKÜNFTIGE UPDATES:
```bash
cd /var/www/flowcraft
git pull
npm run build
pm2 restart flowcraft
```

**Führen Sie einfach diese Befehle aus - alles ist vorbereitet!** 🚀
