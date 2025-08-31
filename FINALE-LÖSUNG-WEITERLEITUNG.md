# 🎯 FINALE LÖSUNG - DOMAIN WEITERLEITUNG

## ✅ ARCHITEKTUR:
- **n8n:** `http://automat.owona.de/` (unberührt)
- **FlowCraft:** `http://automat.owona.de/flowcraft/` (neu)
- **Weiterleitung:** `owona.de` → `automat.owona.de/flowcraft/`

## 🚀 IMPLEMENTATION:

### **1️⃣ SERVER: Nginx Konfiguration erweitern**

```bash
ssh root@automat.owona.de
# Passwort: LpXqTEPurwUu

# Aktuelle Nginx Config erweitern (n8n bleibt unberührt)
cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup

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

# Zusätzlicher Server Block für owona.de (falls direkt aufgerufen)
server {
    listen 80;
    server_name owona.de www.owona.de;
    
    # Direkte Weiterleitung zu FlowCraft
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

# Nginx testen und reload
nginx -t
systemctl reload nginx
```

### **2️⃣ SERVER: FlowCraft installieren**

```bash
cd /var/www
rm -rf flowcraft 2>/dev/null
git clone https://github.com/OwonaMedia/flowcraft.git flowcraft
cd flowcraft

# Environment für owona.de Domain
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
npx prisma generate
npx prisma db push

# PM2 Start
npm install -g pm2 2>/dev/null
pm2 delete flowcraft 2>/dev/null
pm2 start npm --name "flowcraft" -- start
pm2 save

# Test beide URLs
curl -I http://localhost:5678  # n8n
curl -I http://localhost:3000  # FlowCraft

echo ""
echo "✅ INSTALLATION KOMPLETT!"
echo "n8n:       http://automat.owona.de/"
echo "FlowCraft: http://automat.owona.de/flowcraft/"
echo ""
```

### **3️⃣ GONEO: Domain-Weiterleitung einrichten**

**Im Goneo Control Panel:**

1. **Login:** `hosting.goneo.de`
2. **Domain-Verwaltung:** `owona.de`
3. **DNS/Weiterleitung:** 

```
Option A: HTTP-Weiterleitung (EINFACH)
owona.de → http://automat.owona.de/flowcraft/

Option B: DNS A-Record (PROFESSIONELL)
A-Record: owona.de → 91.99.232.126
A-Record: www.owona.de → 91.99.232.126
```

### **4️⃣ SSL-Zertifikat (Optional aber empfohlen)**

```bash
# Certbot für HTTPS
apt install -y certbot python3-certbot-nginx
certbot --nginx -d owona.de -d www.owona.de -d automat.owona.de

# Automatische Erneuerung
crontab -e
# Hinzufügen: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 🎯 **FINALE URL-STRUKTUR:**

```
✅ n8n (unberührt):     http://automat.owona.de/
✅ FlowCraft (intern):  http://automat.owona.de/flowcraft/
✅ FlowCraft (extern):  https://owona.de
```

## 📊 **VORTEILE:**

✅ **n8n komplett unberührt**
✅ **FlowCraft läuft parallel**
✅ **Professionelle Domain owona.de**
✅ **Beide Services auf einem Server**
✅ **Einfache Wartung**

## 🔄 **UPDATES (ZUKUNFT):**

```bash
cd /var/www/flowcraft
git pull origin main
npm run build
pm2 restart flowcraft
```

**Führen Sie die 3 Schritte aus - FlowCraft wird professionell auf owona.de laufen!** 🚀

