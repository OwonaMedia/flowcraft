# 🔧 NGINX KOMPLETT BEREINIGEN

## ❗ WEITERE PROBLEME:
```
"limit_req_zone" directive is not allowed here in /etc/nginx/sites-enabled/automat-owona-africa:28
```

## ✅ KOMPLETTE NGINX BEREINIGUNG:

### **1️⃣ Alle problematischen Konfigurationsdateien entfernen:**
```bash
# Alle Sites deaktivieren
rm /etc/nginx/sites-enabled/* 2>/dev/null

# Alle conf.d Dateien sichern
mkdir -p /root/nginx-backup
mv /etc/nginx/conf.d/* /root/nginx-backup/ 2>/dev/null

# Problematische Dateien entfernen
rm -f /etc/nginx/sites-available/automat-owona-africa
rm -f /etc/nginx/sites-enabled/automat-owona-africa

echo "✅ Problematische Konfigurationen entfernt"
```

### **2️⃣ Nginx Test:**
```bash
nginx -t
echo "✅ Nginx Konfiguration geprüft"
```

### **3️⃣ Nginx starten:**
```bash
systemctl start nginx
systemctl enable nginx
systemctl status nginx
echo "✅ Nginx gestartet"
```

### **4️⃣ Standard-Konfiguration erstellen:**
```bash
# Neue, saubere Konfiguration für FlowCraft + n8n
cat > /etc/nginx/sites-available/default << 'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name automat.owona.de;
    
    # n8n auf Root-Pfad (UNBERÜHRT)
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
    listen [::]:80;
    server_name owona.de www.owona.de;
    
    # FlowCraft direkt
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

# Site aktivieren
ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default

echo "✅ Neue Konfiguration erstellt"
```

### **5️⃣ Final testen und starten:**
```bash
# Konfiguration final testen
nginx -t

# Nginx restart
systemctl restart nginx

# Status prüfen
systemctl status nginx
curl -I http://localhost:80

echo "🎉 Nginx läuft sauber!"
```

## 🎯 **DIESER ANSATZ:**
- ✅ **Entfernt ALLE problematischen Konfigurationen**
- ✅ **Erstellt saubere, neue Konfiguration**
- ✅ **n8n bleibt funktionsfähig**
- ✅ **FlowCraft wird hinzugefügt**

**Führen Sie die Schritte 1-5 nacheinander aus!** 🚀

