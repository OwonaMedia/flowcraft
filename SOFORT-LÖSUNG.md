# 🚨 SOFORT-LÖSUNG - SIE SIND IM FALSCHEN TERMINAL!

## ❗ PROBLEM:
Sie sind bereits **im Hetzner-Server** (root@n8n-owown) eingeloggt!
Der Git Push muss aber **vom lokalen Computer** gemacht werden!

## ✅ LÖSUNG:

### 1️⃣ **Server-Terminal verlassen:**
```bash
exit
```
*(Dies bringt Sie zurück zu Ihrem lokalen Mac)*

### 2️⃣ **Lokaler Git Push (auf Ihrem Mac):**
```bash
cd /Users/salomon/Documents/SaaS/botchat-pro
git config --global user.email "salomon@owona.de"
git config --global user.name "Salomon Owona"
git add .
git commit -m "Complete FlowCraft deployment with Supabase integration"
git push -u origin main
```

### 3️⃣ **Zurück zum Server (nach erfolgreichem Push):**
```bash
ssh root@automat.owona.de
# Passwort: LpXqTEPurwUu
```

### 4️⃣ **Server Installation:**
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

npm install --production
npm run build
npx prisma generate
npx prisma db push
npm install -g pm2 2>/dev/null
pm2 delete flowcraft 2>/dev/null
pm2 start npm --name "flowcraft" -- start
pm2 startup
pm2 save
pm2 status
curl -I http://localhost:3000
echo "🎉 FlowCraft läuft!"
```

## 🎯 **WICHTIG:**
- **ERST:** `exit` vom Server
- **DANN:** Git Push vom lokalen Mac
- **DANACH:** Zurück zum Server für Installation

**Tippen Sie jetzt `exit` um den Server zu verlassen!** 🚀
