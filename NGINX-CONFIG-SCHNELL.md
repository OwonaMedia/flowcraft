# 🚀 NGINX KONFIGURATION - SCHNELLE LÖSUNG

## ✅ **STATUS:** Zurück im Terminal, Datei ist leer

## ⚡ **SCHNELLE NGINX KONFIGURATION:**

### **Eine komplette Nginx-Konfiguration mit einem Befehl erstellen:**

```bash
cat > /etc/nginx/sites-available/flowcraft << 'EOF'
server {
    listen 80;
    server_name automat.owona.de;

    # n8n auf Root (UNBERÜHRT)
    location / {
        proxy_pass http://localhost:5678;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # FlowCraft auf /flowcraft/
    location /flowcraft/ {
        proxy_pass http://localhost:3001/;
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

    # Direkte Weiterleitung zu FlowCraft
    location / {
        proxy_pass http://localhost:3001/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Config aktivieren
ln -s /etc/nginx/sites-available/flowcraft /etc/nginx/sites-enabled/

# Config testen
nginx -t

# Nginx neu laden
systemctl reload nginx

# LIVE TEST
curl -I http://automat.owona.de/flowcraft/
```

## 🎯 **ERWARTUNG:**
Nach diesem einen Befehl sollte FlowCraft über `http://automat.owona.de/flowcraft/` erreichbar sein!

**Kopieren Sie den kompletten Block und führen Sie ihn aus!** 🚀

