# 🚨 FLOWCRAFT NICHT ERREICHBAR - SCHNELLE DIAGNOSE

## ❌ **PROBLEM:** 
- http://automat.owona.de:9000/flowcraft/ → Nicht erreichbar
- https://automat.owona.de:9000/flowcraft/ → Nicht erreichbar

## 🔍 **SOFORTIGE DIAGNOSE:**

### **1️⃣ SYSTEM STATUS PRÜFEN:**
```bash
# PM2 Status - läuft FlowCraft?
pm2 list

# Nginx Status - läuft Nginx?
systemctl status nginx

# Port 9000 - ist aktiv?
ss -tulpn | grep :9000

# Port 3001 - läuft FlowCraft direkt?
ss -tulpn | grep :3001
```

### **2️⃣ DIREKTE TESTS:**
```bash
# FlowCraft direkt testen
curl -I http://localhost:3001

# Nginx lokal testen
curl -I http://localhost:9000/flowcraft/

# Extern über automat.owona.de
curl -I http://automat.owona.de:9000/flowcraft/
```

### **3️⃣ LOGS PRÜFEN:**
```bash
# PM2 Logs
pm2 logs flowcraft --lines 5

# Nginx Error Logs
tail -10 /var/log/nginx/error.log

# Nginx Access Logs
tail -10 /var/log/nginx/access.log
```

## ⚡ **SCHNELLE FIXES:**

### **A) SERVICES RESTART:**
```bash
# FlowCraft restart
pm2 restart flowcraft

# Nginx restart
systemctl restart nginx

# Test
curl -I http://localhost:3001
curl -I http://localhost:9000/flowcraft/
```

### **B) FIREWALL PRÜFEN:**
```bash
# UFW Status
ufw status

# Port 9000 öffnen
ufw allow 9000

# Test
curl -I http://automat.owona.de:9000/flowcraft/
```

### **C) NGINX CONFIG PRÜFEN:**
```bash
# Config anzeigen
cat /etc/nginx/sites-enabled/flowcraft

# Config testen
nginx -t

# Reload
systemctl reload nginx
```

## 🎯 **SOFORT AUSFÜHREN:**
```bash
pm2 list
systemctl status nginx
ss -tulpn | grep -E ":(3001|9000)"
curl -I http://localhost:3001
```

**Das zeigt uns den aktuellen Status!** 🔍

