# 🚨 NGINX BIND ERROR - PORT BELEGT

## ❌ **PROBLEM:** `nginx: [emerg] bind()` - Port bereits belegt

## 🔍 **URSACHE FINDEN:**

### **1️⃣ WELCHE PORTS VERSUCHT NGINX:**
```bash
# Nginx Config anzeigen
cat /etc/nginx/sites-enabled/flowcraft

# Alle aktive Nginx Sites
ls -la /etc/nginx/sites-enabled/

# Default Config prüfen
cat /etc/nginx/sites-enabled/default 2>/dev/null || echo "Keine default config"
```

### **2️⃣ BELEGTE PORTS PRÜFEN:**
```bash
# Alle belegten Ports
ss -tulpn | grep -E ":(80|443|8080|8090)"

# Was blockiert diese Ports?
lsof -i :80 2>/dev/null || echo "Port 80 frei"
lsof -i :8080 2>/dev/null || echo "Port 8080 frei" 
lsof -i :8090 2>/dev/null || echo "Port 8090 frei"
```

## ⚡ **SOFORTIGE LÖSUNG:**

### **A) NGINX CONFIG BEREINIGEN:**
```bash
# Alle Sites deaktivieren
rm -f /etc/nginx/sites-enabled/*

# Nur unsere FlowCraft Config aktivieren
ln -s /etc/nginx/sites-available/flowcraft /etc/nginx/sites-enabled/

# Config prüfen
nginx -t

# Starten
systemctl start nginx
```

### **B) ALTERNATIVEN PORT VERWENDEN:**
```bash
# FlowCraft auf Port 9000 (garantiert frei)
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
    
    location / {
        return 301 /flowcraft/;
    }
}
EOF

# Aktivieren
rm -f /etc/nginx/sites-enabled/*
ln -s /etc/nginx/sites-available/flowcraft /etc/nginx/sites-enabled/

# Test und Start
nginx -t
systemctl start nginx

# Test
curl -I http://automat.owona.de:9000/flowcraft/
```

## 🚀 **QUICK FIX:**
```bash
# Sites bereinigen
rm -f /etc/nginx/sites-enabled/*

# FlowCraft auf Port 9000
cat > /etc/nginx/sites-available/flowcraft << 'EOF'
server {
    listen 9000;
    location /flowcraft/ {
        proxy_pass http://localhost:3001/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

ln -s /etc/nginx/sites-available/flowcraft /etc/nginx/sites-enabled/
nginx -t
systemctl start nginx
curl -I http://automat.owona.de:9000/flowcraft/
```

## 🎯 **ERWARTUNG:**
**HTTP/1.1 200 OK** auf Port 9000

**STARTEN SIE MIT: `ls -la /etc/nginx/sites-enabled/`** 🔍

