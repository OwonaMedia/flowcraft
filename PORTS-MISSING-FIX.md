# 🚨 PORTS FEHLEN - FLOWCRAFT REPARATUR

## ❌ **PROBLEM:** Ports 3001 und 9000 nicht aktiv

## 🔍 **WEITERE DIAGNOSE:**

### **1️⃣ VOLLSTÄNDIGE PORT-LISTE:**
```bash
# Alle Ports anzeigen
ss -tulpn | head -20

# PM2 Details
pm2 show flowcraft

# Nginx Prozesse
ps aux | grep nginx

# FlowCraft direkt testen
curl -I http://localhost:3001 || echo "Port 3001 nicht erreichbar"
```

### **2️⃣ NGINX CONFIG PRÜFEN:**
```bash
# Nginx Config anzeigen
cat /etc/nginx/sites-enabled/flowcraft

# Nginx Error Logs
tail -10 /var/log/nginx/error.log

# Nginx testen
nginx -t
```

## ⚡ **REPARATUR:**

### **A) FLOWCRAFT RESTART:**
```bash
# FlowCraft komplett neu starten
cd /var/www/flowcraft
pm2 delete flowcraft
PORT=3001 pm2 start npm --name "flowcraft" -- run dev
pm2 save

# Status prüfen
pm2 list
ss -tulpn | grep :3001
curl -I http://localhost:3001
```

### **B) NGINX RESTART:**
```bash
# Nginx komplett neu starten
systemctl stop nginx
systemctl start nginx

# Status prüfen
systemctl status nginx
ss -tulpn | grep :9000
curl -I http://localhost:9000/flowcraft/
```

### **C) FIREWALL:**
```bash
# Firewall Status
ufw status

# Ports öffnen
ufw allow 3001
ufw allow 9000

# Test
curl -I http://automat.owona.de:9000/flowcraft/
```

## 🚀 **QUICK FIX:**
```bash
cd /var/www/flowcraft
pm2 restart flowcraft
systemctl restart nginx
ss -tulpn | grep -E ":(3001|9000)"
curl -I http://localhost:3001
curl -I http://localhost:9000/flowcraft/
```

**STARTEN SIE MIT: `ss -tulpn | head -20`** 🔍

