# 🔧 NGINX KONFIGURATIONSFEHLER BEHEBEN

## ❗ PROBLEM:
```
"location" directive is not allowed here in /etc/nginx/conf.d/mcp-servers.conf:5
```

## ✅ LÖSUNG:

### **1️⃣ Fehlerhafte Datei entfernen/umbenennen:**
```bash
# Fehlerhafte Datei verschieben
mv /etc/nginx/conf.d/mcp-servers.conf /etc/nginx/conf.d/mcp-servers.conf.backup

# Oder löschen
rm /etc/nginx/conf.d/mcp-servers.conf

echo "✅ Fehlerhafte Konfiguration entfernt"
```

### **2️⃣ Nginx Konfiguration testen:**
```bash
# Test ob Konfiguration jetzt korrekt ist
nginx -t

echo "✅ Nginx Konfiguration geprüft"
```

### **3️⃣ Nginx starten:**
```bash
# Nginx starten
systemctl start nginx
systemctl enable nginx

# Status prüfen
systemctl status nginx

echo "✅ Nginx gestartet"
```

### **4️⃣ FlowCraft Konfiguration anwenden:**
```bash
# Backup der Standard-Konfiguration
cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup

# Neue Konfiguration für n8n + FlowCraft
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

echo "✅ FlowCraft Konfiguration angewendet"
```

### **5️⃣ Status final prüfen:**
```bash
# Services prüfen
systemctl status nginx
curl -I http://localhost:80

echo "🎉 Nginx läuft korrekt!"
```

## 🎯 **REIHENFOLGE:**
1. **Fehlerhafte Datei entfernen** (Schritt 1)
2. **Nginx starten** (Schritt 3)  
3. **FlowCraft Konfiguration** (Schritt 4)
4. **Status prüfen** (Schritt 5)

**Führen Sie zuerst Schritt 1 aus: `mv /etc/nginx/conf.d/mcp-servers.conf /etc/nginx/conf.d/mcp-servers.conf.backup`** 🚀

