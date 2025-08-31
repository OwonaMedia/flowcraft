# 🔍 SERVER STATUS PRÜFEN

## ❗ PROBLEM:
`automat.owona.de:3000` ist nicht erreichbar.

## ✅ LÖSUNGEN:

### 1️⃣ **SSH zum Server und Status prüfen:**
```bash
ssh root@automat.owona.de
# Passwort: LpXqTEPurwUu
```

### 2️⃣ **FlowCraft Status prüfen:**
```bash
# PM2 Status
pm2 status

# Port 3000 prüfen
netstat -tlnp | grep :3000

# FlowCraft Verzeichnis prüfen
ls -la /var/www/flowcraft

# Prozesse prüfen
ps aux | grep node
```

### 3️⃣ **Falls FlowCraft nicht läuft - Installation starten:**
```bash
cd /var/www
rm -rf flowcraft 2>/dev/null
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
pm2 save

# Test
curl -I http://localhost:3000
echo "FlowCraft Status geprüft!"
```

### 4️⃣ **Firewall prüfen (falls Port 3000 blockiert):**
```bash
# Firewall Status
ufw status

# Port 3000 freigeben
ufw allow 3000

# Alternative: Nginx Proxy auf Port 80
apt update
apt install -y nginx
cat > /etc/nginx/sites-available/flowcraft << 'EOF'
server {
    listen 80;
    server_name automat.owona.de;
    
    location / {
        proxy_pass http://localhost:3000;
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

ln -s /etc/nginx/sites-available/flowcraft /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default 2>/dev/null
nginx -t
systemctl restart nginx
```

## 🎯 **NACH DER REPARATUR:**

- **Test:** `http://automat.owona.de:3000` (direkt)
- **Alternative:** `http://automat.owona.de` (via Nginx)

**Führen Sie die SSH-Diagnose durch!** 🔍

