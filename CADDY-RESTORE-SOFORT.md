# 🚨 CADDY SOFORT WIEDER STARTEN - N8N REPARIEREN

## ⚡ **SOFORTIGE REPARATUR:**

### **1️⃣ CADDY CONTAINER WIEDER STARTEN:**
```bash
# Caddy Container wieder starten
docker start 6cc31823d5c3

# Status prüfen
docker ps | grep caddy

# n8n testen
curl -I http://automat.owona.de/
```

### **2️⃣ NGINX STOPPEN (KONFLIKT VERMEIDEN):**
```bash
# Nginx stoppen
systemctl stop nginx

# Port 80 freigeben für Caddy
ss -tulpn | grep :80

# n8n nochmal testen
curl -I http://automat.owona.de/
```

### **3️⃣ ALTERNATIVE LÖSUNG - NGINX AUF ANDEREM PORT:**
```bash
# Nginx auf Port 8080 konfigurieren
cat > /etc/nginx/sites-available/flowcraft << 'EOF'
server {
    listen 8080;
    server_name automat.owona.de;

    # FlowCraft auf /flowcraft/
    location /flowcraft/ {
        proxy_pass http://localhost:3001/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Nginx auf Port 8080 starten
systemctl start nginx

# FlowCraft über Port 8080 testen
curl -I http://automat.owona.de:8080/flowcraft/
```

## 🎯 **SOFORT AUSFÜHREN:**
```bash
docker start 6cc31823d5c3
systemctl stop nginx
curl -I http://automat.owona.de/
```

**Das stellt n8n sofort wieder her!** 🚀

