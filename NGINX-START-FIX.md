# 🔧 NGINX START FIX

## ❗ PROBLEM:
`nginx.service is not active, cannot reload`

## ✅ LÖSUNG:

### **1️⃣ Nginx starten:**
```bash
# Nginx Service starten
systemctl start nginx

# Nginx Status prüfen
systemctl status nginx

# Nginx beim Boot automatisch starten
systemctl enable nginx

echo "✅ Nginx gestartet"
```

### **2️⃣ Falls Fehler auftreten - Nginx installieren:**
```bash
# Nginx installieren (falls nicht vorhanden)
apt update
apt install -y nginx

# Nginx starten
systemctl start nginx
systemctl enable nginx

echo "✅ Nginx installiert und gestartet"
```

### **3️⃣ Dann die Konfiguration anwenden:**
```bash
# Backup erstellen
cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup

# Neue Konfiguration
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

# Konfiguration testen
nginx -t

# Nginx neu laden
systemctl restart nginx

echo "✅ Nginx konfiguriert und neu gestartet"
```

### **4️⃣ Status prüfen:**
```bash
# Nginx Status
systemctl status nginx

# Ports prüfen
netstat -tlnp | grep nginx

# Test URLs
curl -I http://localhost:80

echo "✅ Nginx läuft"
```

## 🎯 **REIHENFOLGE:**
1. Nginx starten (Schritt 1)
2. Konfiguration anwenden (Schritt 3)
3. Status prüfen (Schritt 4)
4. Dann FlowCraft installieren

**Führen Sie zuerst Schritt 1 aus!** 🚀

