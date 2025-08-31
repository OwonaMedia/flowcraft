# 🔧 PORT 8080 KONFLIKT & NGINX FIX

## ✅ **FORTSCHRITT:** Port 8080 antwortet (`X-Powered-By: Express`)
## ❌ **PROBLEME:** Nginx failed, 404 Not Found

## 🔍 **DIAGNOSE:**

### **1️⃣ WAS LÄUFT AUF PORT 8080:**
```bash
# Port 8080 Status
ss -tulpn | grep :8080

# Welcher Prozess?
lsof -i :8080

# Alle Express/Node Prozesse
ps aux | grep node
```

### **2️⃣ NGINX FEHLER PRÜFEN:**
```bash
# Nginx Fehler-Details
systemctl status nginx.service
journalctl -xeu nginx.service -n 10

# Nginx Config testen
nginx -t
```

## ⚡ **LÖSUNGEN:**

### **A) ALTERNATIVEN PORT FÜR NGINX:**
```bash
# Nginx auf Port 8090 (frei)
cat > /etc/nginx/sites-available/flowcraft << 'EOF'
server {
    listen 8090;
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

# Nginx auf Port 8090 starten
systemctl start nginx

# Test
curl -I http://automat.owona.de:8090/flowcraft/
```

### **B) FLOWCRAFT DIREKT TESTEN:**
```bash
# FlowCraft PM2 Status
pm2 list

# FlowCraft direkt
curl -I http://localhost:3001

# Falls FlowCraft nicht läuft
pm2 restart flowcraft
curl -I http://localhost:3001
```

### **C) EXPRESS SERVER AUF 8080 IDENTIFIZIEREN:**
```bash
# Was ist der Express Server?
ss -tulpn | grep :8080
ps aux | grep node | grep 8080

# Möglicherweise ein anderer Service
docker ps | grep 8080
```

## 🚀 **QUICK FIX:**
```bash
# Alternativen Port verwenden
cat > /etc/nginx/sites-available/flowcraft << 'EOF'
server {
    listen 8090;
    location /flowcraft/ {
        proxy_pass http://localhost:3001/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

systemctl start nginx
pm2 restart flowcraft
curl -I http://automat.owona.de:8090/flowcraft/
```

## 🎯 **ERWARTUNG:**
**HTTP/1.1 200 OK** auf Port 8090

**STARTEN SIE MIT: `ss -tulpn | grep :8080`** 🔍

