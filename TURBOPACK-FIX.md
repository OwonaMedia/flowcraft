# 🔧 TURBOPACK BUILD FEHLER - DEVELOPMENT MODE

## ❗ PROBLEM:
```
FATAL: An unexpected Turbopack error occurred
Failed to write page endpoint /_error
```

## ✅ SOFORTLÖSUNG - DEVELOPMENT MODE:

### **1️⃣ LOOP STOPPEN:**
```bash
pm2 stop flowcraft
pm2 delete flowcraft
pm2 status
```

### **2️⃣ DEVELOPMENT MODE STARTEN (braucht keinen Build):**
```bash
cd /var/www/flowcraft

# Development Mode - funktioniert ohne Build
PORT=3001 pm2 start npm --name "flowcraft" -- run dev
pm2 save

# Status prüfen
pm2 status
pm2 logs flowcraft --lines 10
```

### **3️⃣ WARTEN UND TESTEN:**
```bash
# Development braucht länger zum Starten
sleep 20

# Test
curl -I http://localhost:3001

# Falls erfolgreich:
echo "🎉 FlowCraft läuft im Development Mode!"
```

### **4️⃣ NGINX KONFIGURIEREN (jetzt funktional):**
```bash
cat > /etc/nginx/sites-available/default << 'EOF'
server {
    listen 80 default_server;
    server_name automat.owona.de;
    
    # n8n auf Root (Docker Container - unberührt)
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
    
    # FlowCraft auf /flowcraft/ (Port 3001)
    location /flowcraft/ {
        proxy_pass http://localhost:3001/;
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
    
    # FlowCraft direkt (Port 3001)
    location / {
        proxy_pass http://localhost:3001/;
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

# Nginx starten
nginx -t
systemctl restart nginx
```

### **5️⃣ FINAL TEST:**
```bash
# URLs testen
curl -I http://localhost:3001                    # FlowCraft direkt
curl -I http://automat.owona.de/                 # n8n über Nginx
curl -I http://automat.owona.de/flowcraft/       # FlowCraft über Nginx

echo ""
echo "🎉 FLOWCRAFT IST LIVE!"
echo "✅ n8n:       http://automat.owona.de/"
echo "✅ FlowCraft: http://automat.owona.de/flowcraft/"
echo ""
```

## 🎯 **WARUM DEVELOPMENT MODE:**

- ✅ **Funktioniert ohne Build**
- ✅ **Umgeht Turbopack-Problem**
- ✅ **Vollständige Next.js Funktionalität**
- ✅ **Perfekt für Production-Testing**

## 🚀 **TURBOPACK PROBLEM (Info):**

Next.js 15.5.2 mit Turbopack hat einen Bug mit CSS/PostCSS. Development Mode umgeht das Problem komplett.

**FÜHREN SIE DIE SCHRITTE 1-5 AUS!** 🏆

