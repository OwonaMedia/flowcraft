# 🎉 FLOWCRAFT GEFUNDEN! PORT 3001 LÄUFT!

## ✅ **FLOWCRAFT BESTÄTIGT:**
- **Port:** 3001 ✅
- **Status:** HTTP 200 OK ✅
- **Framework:** Next.js ✅
- **Font Loading:** Aktiv ✅

## 🔧 **JETZT NGINX + FIREWALL REPARIEREN:**

### **1️⃣ NGINX CONFIG PRÜFEN:**
```bash
# Nginx Config anzeigen
cat /etc/nginx/sites-enabled/flowcraft

# Sollte zeigen: proxy_pass http://localhost:3001/;
# Falls nicht, dann korrigieren:
cat > /etc/nginx/sites-available/flowcraft << 'EOF'
server {
    listen 9000;
    server_name automat.owona.de;
    
    location /flowcraft/ {
        proxy_pass http://localhost:3001/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Nginx reload
systemctl reload nginx
```

### **2️⃣ FIREWALL PORTS ÖFFNEN:**
```bash
# UFW Status prüfen
ufw status

# Port 9000 öffnen (Nginx)
ufw allow 9000/tcp

# Optional: Port 3001 direkt öffnen
ufw allow 3001/tcp

# Status prüfen
ufw status numbered
```

### **3️⃣ TESTS:**
```bash
# Nginx lokal testen
curl -I http://localhost:9000/flowcraft/

# FlowCraft direkt extern testen
curl -I http://automat.owona.de:3001

# FlowCraft über Nginx extern testen
curl -I http://automat.owona.de:9000/flowcraft/
```

## 🚀 **QUICK FIX SEQUENCE:**
```bash
# 1. Firewall öffnen
ufw allow 9000
ufw allow 3001

# 2. Nginx testen
curl -I http://localhost:9000/flowcraft/

# 3. Extern testen
curl -I http://automat.owona.de:3001
curl -I http://automat.owona.de:9000/flowcraft/
```

## 🎯 **ERWARTETE URLS:**
- **FlowCraft direkt:** http://automat.owona.de:3001 ✅
- **FlowCraft über Nginx:** http://automat.owona.de:9000/flowcraft/ ✅

**PROBLEM WAR: FIREWALL BLOCKIERT DIE PORTS!** 🔥

