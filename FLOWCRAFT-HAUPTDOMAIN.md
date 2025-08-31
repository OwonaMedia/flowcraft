# 🌐 FLOWCRAFT AUF HAUPTDOMAIN OWONA.DE

## 🎯 ZIEL:
**FlowCraft läuft auf `https://owona.de` (Hauptdomain)**

## 📋 STRATEGIE:

### **Option 1: Separater Hetzner Server (EMPFOHLEN)**

**1️⃣ Neuen Hetzner Server für FlowCraft:**
- **Domain:** `owona.de` → Neuer FlowCraft Server
- **n8n:** Bleibt auf `automat.owona.de`
- **Vorteil:** Keine Konflikte, saubere Trennung

### **Option 2: Domain-Umleitung (EINFACHER)**

**1️⃣ Goneo Domain-Verwaltung:**
- `owona.de` → zeigt auf Hetzner Server IP `91.99.232.126`
- FlowCraft läuft auf Port 80 (Hauptport)
- n8n wird auf Subdomain umgeleitet

**2️⃣ Server-Konfiguration:**
```bash
# FlowCraft auf Port 80
# n8n auf Subdomain n8n.owona.de

# Nginx Konfiguration
server {
    listen 80;
    server_name owona.de;
    
    # FlowCraft als Hauptseite
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

server {
    listen 80;
    server_name n8n.owona.de automat.owona.de;
    
    # n8n auf Subdomain
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
}
```

## 🚀 **IMPLEMENTATION (Option 2):**

### **1️⃣ SSH zum Server:**
```bash
ssh root@automat.owona.de
```

### **2️⃣ Nginx für owona.de konfigurieren:**
```bash
# Nginx Konfiguration für owona.de
cat > /etc/nginx/sites-available/owona << 'EOF'
server {
    listen 80;
    server_name owona.de www.owona.de;
    
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

server {
    listen 80;
    server_name automat.owona.de n8n.owona.de;
    
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
}
EOF

# Site aktivieren
ln -s /etc/nginx/sites-available/owona /etc/nginx/sites-enabled/owona
rm /etc/nginx/sites-enabled/default 2>/dev/null

# Nginx testen
nginx -t
systemctl reload nginx
```

### **3️⃣ FlowCraft installieren:**
```bash
cd /var/www
rm -rf flowcraft 2>/dev/null
git clone https://github.com/OwonaMedia/flowcraft.git flowcraft
cd flowcraft

# Environment für owona.de
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

# PM2
npm install -g pm2 2>/dev/null
pm2 delete flowcraft 2>/dev/null
pm2 start npm --name "flowcraft" -- start
pm2 save

echo "✅ FlowCraft für owona.de installiert!"
```

### **4️⃣ Domain-Umleitung (Goneo Panel):**
```
1. Goneo-Login: hosting.goneo.de
2. Domain-Verwaltung: owona.de
3. DNS-Einstellungen:
   - A-Record: owona.de → 91.99.232.126
   - A-Record: www.owona.de → 91.99.232.126
   - A-Record: n8n.owona.de → 91.99.232.126
```

## 🎯 **FINALE URL-STRUKTUR:**

- **FlowCraft:** `https://owona.de` (Hauptdomain)
- **n8n:** `https://automat.owona.de` oder `https://n8n.owona.de`

## 🔒 **SSL-ZERTIFIKAT:**

```bash
# Certbot für HTTPS
apt install -y certbot python3-certbot-nginx
certbot --nginx -d owona.de -d www.owona.de
```

**Führen Sie die Server-Konfiguration aus, dann die Domain-Umleitung!** 🚀

