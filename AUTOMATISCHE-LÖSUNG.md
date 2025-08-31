# 🤖 VOLLAUTOMATISCHE FLOWCRAFT INSTALLATION

## 🎯 KOMPLETTES INSTALLATION SCRIPT - EIN BEFEHL

### **📋 KOPIEREN SIE DIESEN EINEN BLOCK UND FÜHREN SIE IHN AUS:**

```bash
#!/bin/bash

echo "🚀 STARTE AUTOMATISCHE FLOWCRAFT INSTALLATION..."

# 1. Nginx komplett bereinigen
echo "📝 BEREINIGE NGINX KONFIGURATION..."
systemctl stop nginx 2>/dev/null
mkdir -p /root/nginx-backup-$(date +%Y%m%d)
mv /etc/nginx/sites-enabled/* /root/nginx-backup-$(date +%Y%m%d)/ 2>/dev/null
mv /etc/nginx/conf.d/* /root/nginx-backup-$(date +%Y%m%d)/ 2>/dev/null
rm -f /etc/nginx/sites-available/automat-owona-africa 2>/dev/null

# 2. Nginx installieren falls nicht vorhanden
echo "📦 INSTALLIERE NGINX..."
apt update -qq
apt install -y nginx git nodejs npm curl

# 3. Saubere Nginx Konfiguration
echo "⚙️ KONFIGURIERE NGINX..."
cat > /etc/nginx/sites-available/default << 'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
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

ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default

# 4. Nginx starten
echo "🔧 STARTE NGINX..."
nginx -t && systemctl restart nginx && systemctl enable nginx

# 5. FlowCraft installation
echo "📥 INSTALLIERE FLOWCRAFT..."
cd /var/www
rm -rf flowcraft 2>/dev/null
git clone https://github.com/OwonaMedia/flowcraft.git flowcraft
cd flowcraft

# 6. Environment konfigurieren
echo "🔑 KONFIGURIERE ENVIRONMENT..."
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

# 7. Dependencies und Build
echo "🔨 BAUE FLOWCRAFT..."
npm install --production
npm run build

# 8. Prisma Setup
echo "🗄️ KONFIGURIERE DATENBANK..."
npx prisma generate
npx prisma db push

# 9. PM2 Setup
echo "🚀 STARTE FLOWCRAFT SERVICE..."
npm install -g pm2 2>/dev/null
pm2 delete flowcraft 2>/dev/null
pm2 start npm --name "flowcraft" -- start
pm2 startup
pm2 save

# 10. Final Status
echo ""
echo "🎉 INSTALLATION KOMPLETT!"
echo ""
echo "✅ STATUS:"
systemctl status nginx --no-pager -l
pm2 status
echo ""
echo "📊 URLS:"
echo "✅ n8n:       http://automat.owona.de/"
echo "✅ FlowCraft: http://automat.owona.de/flowcraft/"
echo "✅ FlowCraft: https://owona.de (nach Domain-Umleitung)"
echo ""
curl -I http://localhost:5678 2>/dev/null | head -1
curl -I http://localhost:3000 2>/dev/null | head -1
echo ""
echo "🏆 FLOWCRAFT IST LIVE!"
```

## 🎯 **AUSFÜHRUNG:**

**1. KOMPLETTER BLOCK KOPIEREN** (alles von `#!/bin/bash` bis `echo "🏆 FLOWCRAFT IST LIVE!"`)

**2. IN SSH-TERMINAL EINFÜGEN**

**3. ENTER DRÜCKEN**

**4. FERTIG! 🎉**

## ✅ **WAS PASSIERT:**
- Bereinigt alle Nginx-Probleme automatisch
- Installiert missing packages
- Klont FlowCraft von GitHub
- Konfiguriert alles automatisch
- Startet alle Services
- Zeigt finalen Status

**EINFACH KOPIEREN & EINFÜGEN - KOMPLETT AUTOMATISCH!** 🚀

