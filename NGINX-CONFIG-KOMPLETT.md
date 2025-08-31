# 🔧 NGINX KONFIGURATION - KOMPLETT

## ✅ Sie sind auf dem Server! Führen Sie diese Befehle aus:

### **1️⃣ NGINX BACKUP & KONFIGURATION:**

```bash
# Backup erstellen
cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup

# Neue Konfiguration schreiben
cat > /etc/nginx/sites-available/default << 'EOF'
server {
    listen 80;
    server_name automat.owona.de;
    
    # n8n auf Root (UNBERÜHRT)
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
    
    # FlowCraft auf /flowcraft/ (NEU)
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

# Nginx testen
nginx -t

# Nginx neu laden
systemctl reload nginx

echo "✅ Nginx konfiguriert!"
```

### **2️⃣ FLOWCRAFT INSTALLATION:**

```bash
cd /var/www
rm -rf flowcraft 2>/dev/null
git clone https://github.com/OwonaMedia/flowcraft.git flowcraft
cd flowcraft

# Environment konfigurieren
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

# Installation
npm install --production
npm run build

# Prisma
npx prisma generate
npx prisma db push

# PM2
npm install -g pm2 2>/dev/null
pm2 delete flowcraft 2>/dev/null
pm2 start npm --name "flowcraft" -- start
pm2 save

# Status
pm2 status
curl -I http://localhost:3000

echo ""
echo "🎉 FLOWCRAFT INSTALLATION KOMPLETT!"
echo "✅ n8n:       http://automat.owona.de/"
echo "✅ FlowCraft: http://automat.owona.de/flowcraft/"
echo ""
```

**Führen Sie die Befehle Block für Block aus!** 🚀

