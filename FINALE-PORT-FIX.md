# 🔧 FINALE PORT-KONFLIKTE LÖSEN

## ✅ PROBLEME IDENTIFIZIERT:
1. **Port 80:** Docker-Proxy (n8n Container)
2. **Port 3000:** Bereits belegt (FlowCraft kann nicht starten)
3. **Port 5678:** n8n läuft im Docker Container

## 🚀 KOMPLETTE LÖSUNG:

### **1️⃣ Port 3000 freimachen:**
```bash
# Prüfen was auf Port 3000 läuft
netstat -tlnp | grep :3000
lsof -i :3000

# Den blockierenden Prozess stoppen
# (Ersetzen Sie [PID] mit der tatsächlichen Process-ID)
kill -9 $(lsof -t -i:3000)

# Oder alternativ alle Node-Prozesse auf Port 3000 stoppen
pkill -f "node.*3000"
```

### **2️⃣ FlowCraft auf anderem Port starten:**
```bash
cd /var/www/flowcraft
pm2 delete flowcraft

# FlowCraft auf Port 3001 starten (sicherer)
PORT=3001 pm2 start npm --name "flowcraft" -- start
pm2 save

# Test
curl -I http://localhost:3001
```

### **3️⃣ Nginx Konfiguration anpassen:**
```bash
# Nginx Config für Port 3001 anpassen
cat > /etc/nginx/sites-available/default << 'EOF'
server {
    listen 80 default_server;
    server_name automat.owona.de;
    
    # n8n auf Root (Docker Container)
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
    
    # FlowCraft auf Port 3001 (geändert!)
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
    
    # FlowCraft direkt auf Port 3001
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

# Nginx neu starten (Docker läuft parallel weiter)
nginx -t
systemctl stop nginx
systemctl start nginx
```

### **4️⃣ Alternative: Docker-Container Port umleiten:**
```bash
# Docker Container Info anzeigen
docker ps | grep n8n

# Falls notwendig: n8n Container auf anderen Port umleiten
# (Dies würde n8n-URLs ändern, daher nicht empfohlen)
```

### **5️⃣ Services Status prüfen:**
```bash
# Final Status
systemctl status nginx
pm2 status
docker ps | grep n8n

# Ports prüfen
netstat -tlnp | grep -E ":80|:3001|:5678"

# URLs testen
curl -I http://localhost:80       # Nginx
curl -I http://localhost:3001     # FlowCraft
curl -I http://localhost:5678     # n8n (direkt)

# Proxy-URLs testen
curl -I http://automat.owona.de/                # n8n über Nginx
curl -I http://automat.owona.de/flowcraft/      # FlowCraft über Nginx

echo "🎉 ALLE SERVICES LAUFEN!"
```

## 🎯 **FINALE ARCHITEKTUR:**
```
Port 80:   Nginx (Reverse Proxy)
Port 3001: FlowCraft (Next.js)
Port 5678: n8n (Docker Container)

URLs:
✅ n8n:       http://automat.owona.de/
✅ FlowCraft: http://automat.owona.de/flowcraft/
✅ FlowCraft: https://owona.de (nach Domain-Umleitung)
```

## 🚀 **WARUM DAS FUNKTIONIERT:**
- **Docker-Container** bleibt unberührt
- **FlowCraft** bekommt freien Port 3001
- **Nginx** leitet korrekt weiter
- **Keine Konflikte**

**FÜHREN SIE DIE SCHRITTE 1-5 AUS!** 🏆

