# 🔍 FLOWCRAFT PORT MYSTERY GELÖST!

## ✅ **ERKENNTNISSE:**
- **Nginx Port 9000:** Aktiv ✅
- **FlowCraft Response:** HTTP 200 OK ✅
- **Port 3001:** Nicht in der Liste ❌

## 🕵️ **FLOWCRAFT LÄUFT AUF ANDEREM PORT!**

### **1️⃣ FLOWCRAFT PORT FINDEN:**
```bash
# PM2 Details mit Port
pm2 show flowcraft

# Alle Node.js Ports
ss -tulpn | grep node

# PM2 Environment
pm2 env 0

# FlowCraft Logs (zeigen Port)
pm2 logs flowcraft --lines 3
```

### **2️⃣ NGINX CONFIG ANPASSEN:**
```bash
# Aktueller Port in Nginx Config
cat /etc/nginx/sites-enabled/flowcraft | grep proxy_pass

# Falls FlowCraft auf anderem Port läuft, Config anpassen
# Zum Beispiel wenn FlowCraft auf Port 8080 läuft:
sed -i 's/localhost:3001/localhost:RICHTIGER_PORT/g' /etc/nginx/sites-enabled/flowcraft

# Nginx reload
systemctl reload nginx
```

### **3️⃣ EXTERNE ERREICHBARKEIT TESTEN:**
```bash
# Nginx lokal testen
curl -I http://localhost:9000/flowcraft/

# UFW Firewall prüfen
ufw status

# Port 9000 öffnen falls nötig
ufw allow 9000

# Extern testen
curl -I http://automat.owona.de:9000/flowcraft/
```

## 🚀 **QUICK DIAGNOSE:**
```bash
# 1. FlowCraft Port finden
pm2 logs flowcraft --lines 3

# 2. Alle Node Ports
ss -tulpn | grep node

# 3. Nginx Config prüfen
cat /etc/nginx/sites-enabled/flowcraft | grep proxy_pass

# 4. Firewall
ufw status

# 5. Extern testen
curl -I http://automat.owona.de:9000/flowcraft/
```

## 🎯 **WAHRSCHEINLICHE LÖSUNG:**

**FlowCraft läuft auf einem der Node Ports (8011, 8012, 8013)**

**Nginx Config muss auf den richtigen Port zeigen!**

**STARTEN SIE MIT: `pm2 logs flowcraft --lines 3`** 🔍

