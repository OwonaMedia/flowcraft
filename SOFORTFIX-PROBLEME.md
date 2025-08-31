# 🚨 SOFORTFIX FÜR BEIDE PROBLEME

## ❗ IDENTIFIZIERTE PROBLEME:
1. **FlowCraft:** Status `errored` (15 Neustarts)
2. **Nginx:** `bind() failed` - Port 80 bereits belegt

## ✅ STEP-BY-STEP FIX:

### **1️⃣ Port 80 Problem lösen:**
```bash
# Prüfen was auf Port 80 läuft
netstat -tlnp | grep :80
lsof -i :80

# n8n läuft wahrscheinlich direkt auf Port 80
# n8n Prozess finden und stoppen
ps aux | grep n8n
# pm2 list (falls n8n über pm2 läuft)
pm2 list
```

### **2️⃣ n8n auf korrekten Port umstellen:**
```bash
# Falls n8n über pm2 läuft:
pm2 stop n8n 2>/dev/null
pm2 delete n8n 2>/dev/null

# n8n auf Port 5678 starten (wie geplant)
# Prüfen Sie die n8n Konfiguration:
ps aux | grep n8n
# Stoppen Sie alle n8n Prozesse:
pkill -f n8n

# n8n korrekt auf Port 5678 starten:
export N8N_PORT=5678
export N8N_HOST=0.0.0.0
pm2 start n8n --name "n8n" -- start
pm2 save
```

### **3️⃣ FlowCraft Fehler analysieren:**
```bash
# FlowCraft Logs anschauen
pm2 logs flowcraft --lines 50

# FlowCraft stoppen und manuell testen
pm2 delete flowcraft
cd /var/www/flowcraft

# Environment prüfen
cat .env.local

# Dependencies prüfen
npm install --production

# Build testen
npm run build

# Manuell starten zum Testen
npm start
```

### **4️⃣ Wenn FlowCraft Build-Fehler hat:**
```bash
cd /var/www/flowcraft

# Node.js Version prüfen
node --version
npm --version

# Falls Node.js zu alt:
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Clean install
rm -rf node_modules package-lock.json .next
npm install --production
npm run build
```

### **5️⃣ Services korrekt starten:**
```bash
# 1. n8n auf Port 5678
pm2 delete n8n 2>/dev/null
export N8N_PORT=5678
pm2 start n8n --name "n8n" -- start

# 2. FlowCraft auf Port 3000
cd /var/www/flowcraft
pm2 delete flowcraft 2>/dev/null
pm2 start npm --name "flowcraft" -- start

# 3. PM2 speichern
pm2 save

# 4. Status prüfen
pm2 status
```

### **6️⃣ Nginx starten:**
```bash
# Jetzt sollte Port 80 frei sein
nginx -t
systemctl start nginx
systemctl status nginx
```

### **7️⃣ Final Test:**
```bash
# Services testen
curl -I http://localhost:5678  # n8n
curl -I http://localhost:3000  # FlowCraft
curl -I http://localhost:80    # Nginx

# URLs testen
curl -I http://automat.owona.de/
curl -I http://automat.owona.de/flowcraft/

echo "🎉 Test komplett!"
```

## 🎯 **WAHRSCHEINLICHE URSACHE:**

**n8n läuft direkt auf Port 80** statt auf Port 5678, deshalb kann Nginx nicht starten.

**FÜHREN SIE DIE SCHRITTE 1-7 AUS!** 🚀

