# 🔍 FLOWCRAFT PORT FINDEN - FINAL

## ✅ **FLOWCRAFT LÄUFT:** `HEAD / 200 in 46ms`

## 🕵️ **PORT FINDEN:**

### **1️⃣ NODE PORTS DIREKT SUCHEN:**
```bash
# Alle Node.js Prozesse mit Ports
ss -tulpn | grep node

# PM2 Prozess Details
pm2 show 0

# Lsof für FlowCraft Prozess
lsof -p $(pm2 jlist | jq -r '.[0].pid') 2>/dev/null | grep LISTEN
```

### **2️⃣ ALLE MÖGLICHEN PORTS TESTEN:**
```bash
# Node Ports einzeln testen
curl -I http://localhost:8011 2>/dev/null && echo "✅ Port 8011"
curl -I http://localhost:8012 2>/dev/null && echo "✅ Port 8012"  
curl -I http://localhost:8013 2>/dev/null && echo "✅ Port 8013"
curl -I http://localhost:3000 2>/dev/null && echo "✅ Port 3000"
curl -I http://localhost:3001 2>/dev/null && echo "✅ Port 3001"

# Nginx aktueller Proxy-Port
curl -I http://localhost:9000/flowcraft/ 2>/dev/null && echo "✅ Nginx Proxy funktioniert"
```

### **3️⃣ FIREWALL UND EXTERNE ERREICHBARKEIT:**
```bash
# UFW Status
ufw status

# Port 9000 explizit öffnen
ufw allow 9000/tcp

# Nginx Config anzeigen
cat /etc/nginx/sites-enabled/flowcraft

# Extern testen
curl -I http://automat.owona.de:9000/flowcraft/
```

### **4️⃣ FLOWCRAFT ENVIRONMENT:**
```bash
# PM2 Environment anzeigen
pm2 env 0

# FlowCraft Prozess anzeigen
ps aux | grep flowcraft

# Working Directory
pm2 show 0 | grep "exec cwd"
```

## 🚀 **QUICK TEST SEQUENCE:**
```bash
# 1. Alle Node Ports testen
curl -I http://localhost:8011 && echo "8011 ✅"
curl -I http://localhost:8012 && echo "8012 ✅"
curl -I http://localhost:8013 && echo "8013 ✅"
curl -I http://localhost:3001 && echo "3001 ✅"

# 2. Firewall öffnen
ufw allow 9000

# 3. Nginx Proxy testen
curl -I http://localhost:9000/flowcraft/

# 4. Extern testen
curl -I http://automat.owona.de:9000/flowcraft/
```

## 🎯 **ERWARTUNG:**
Eine der URLs sollte `X-Powered-By: Next.js` zeigen!

**STARTEN SIE MIT DEN PORT TESTS!** 🔍

