# 🔧 SCHNELLE SERVER-VERBINDUNG

## ❗ PROBLEM:
Sie sind im **lokalen Terminal** (Mac), nicht auf dem Server!

## ✅ LÖSUNG:

### **1️⃣ SSH zum Server:**
```bash
ssh root@automat.owona.de
```
**Passwort:** `LpXqTEPurwUu`

### **2️⃣ Sobald Sie eingeloggt sind, diese Befehle ausführen:**

**NGINX KONFIGURATION:**
```bash
cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup

cat > /etc/nginx/sites-available/default << 'EOF'
server {
    listen 80;
    server_name automat.owona.de;
    
    location / {
        proxy_pass http://localhost:5678;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    location /flowcraft/ {
        proxy_pass http://localhost:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 80;
    server_name owona.de www.owona.de;
    
    location / {
        proxy_pass http://localhost:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

nginx -t
systemctl reload nginx
echo "✅ Nginx konfiguriert"
```

**FLOWCRAFT INSTALLATION:**
```bash
cd /var/www
rm -rf flowcraft 2>/dev/null
git clone https://github.com/OwonaMedia/flowcraft.git flowcraft
cd flowcraft

cat > .env.local << 'EOF'
DATABASE_URL="postgresql://postgres:Afidi2008!@db.ddavuntesnxtyikvmkje.supabase.co:5432/postgres"
NEXTAUTH_SECRET="botchat-pro-super-secret-key-2024"
NEXTAUTH_URL="https://owona.de"
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
pm2 save

pm2 status
curl -I http://localhost:3000
echo "🎉 FlowCraft installiert!"
```

## 🎯 **WICHTIG:**

1. **ERST:** `ssh root@automat.owona.de`
2. **DANN:** Befehle ausführen
3. **PRÜFEN:** `http://automat.owona.de/flowcraft/`

**Machen Sie zuerst die SSH-Verbindung!** 🚀

