# 🔧 FLOWCRAFT SERVER-INSTALLATION FIX

## ❗ PROBLEM IDENTIFIZIERT:
```
fatal: Authentication failed for 'https://github.com/OwonaMedia/flowcraft.git/'
```

**Das Problem:** HTTPS-Clone ohne Authentication vs. SSH-Clone

## ✅ LÖSUNG - KORRIGIERTE BEFEHLE:

### 📋 COPY & PASTE AUF SERVER (SSH: root@automat.owona.de):

```bash
# 1. Aufräumen
cd /var/www
rm -rf flowcraft 2>/dev/null

# 2. Mit SSH clonen (funktioniert ohne Passwort)
git clone git@github.com:OwonaMedia/flowcraft.git flowcraft
cd flowcraft

# 3. Environment
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

# 4. Installation
npm ci --production
npm run build

# 5. Prisma Setup
npx prisma generate
npx prisma db push

# 6. PM2
npm install -g pm2 2>/dev/null || echo "PM2 bereits installiert"
pm2 delete flowcraft 2>/dev/null || echo "Keine bestehende Instanz"
pm2 start npm --name "flowcraft" -- start
pm2 startup
pm2 save

# 7. Status prüfen
pm2 status
curl -I http://localhost:3000
```

## 🔄 ALTERNATIVE - FALLS SSH NICHT FUNKTIONIERT:

### Option A: GitHub Personal Access Token
```bash
# Erstellen Sie einen Token: https://github.com/settings/tokens
git clone https://OwonaMedia:IHR_TOKEN@github.com/OwonaMedia/flowcraft.git flowcraft
```

### Option B: Public Repository (temporär)
```bash
# Repository kurz auf public setzen für Clone
git clone https://github.com/OwonaMedia/flowcraft.git flowcraft
# Dann wieder auf private setzen
```

## 🎯 ERWARTETES ERGEBNIS:
```
✅ FlowCraft cloned from GitHub
✅ Dependencies installed
✅ Prisma connected to Supabase
✅ PM2 running flowcraft
✅ http://localhost:3000 responding
🎉 FlowCraft läuft auf automat.owona.de:3000
```

## 📋 TROUBLESHOOTING:

**Wenn SSH-Clone fehlschlägt:**
1. SSH-Keys auf Server generieren
2. Public Key zu GitHub hinzufügen
3. Oder HTTPS mit Token verwenden

**SSH-Key Setup auf Server:**
```bash
ssh-keygen -t ed25519 -C "server@automat.owona.de"
cat ~/.ssh/id_ed25519.pub
# Diesen Key zu GitHub hinzufügen: https://github.com/settings/keys
```
