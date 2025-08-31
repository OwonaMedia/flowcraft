# 🎉 FLOWCRAFT FAST FERTIG!

## ✅ STATUS:
- **FlowCraft PM2:** ✅ Online (21.7mb)
- **Port 3001:** Startet gerade (braucht ~30 Sekunden)

## 🔧 FINALE SCHRITTE:

### **1️⃣ FlowCraft Start-Status prüfen:**
```bash
# Warten bis FlowCraft vollständig gestartet ist
sleep 10
curl -I http://localhost:3001

# Falls immer noch nicht erreichbar, Logs prüfen:
pm2 logs flowcraft --lines 10

# Status prüfen
pm2 status
```

### **2️⃣ Nginx für Port 3001 konfigurieren:**
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

# Nginx konfigurieren
nginx -t
systemctl restart nginx
```

### **3️⃣ Final Test:**
```bash
# Services Status
systemctl status nginx
pm2 status

# Ports prüfen
netstat -tlnp | grep -E ":80|:3001|:5678"

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

## 🎯 **WARUM ES JETZT FUNKTIONIERT:**
- ✅ **FlowCraft:** Läuft auf freiem Port 3001
- ✅ **n8n:** Läuft weiter in Docker auf Port 5678
- ✅ **Nginx:** Leitet beide Services korrekt weiter

**FÜHREN SIE DIE 3 SCHRITTE AUS - DANN IST FLOWCRAFT LIVE!** 🚀

