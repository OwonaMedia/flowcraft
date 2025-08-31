# 🔍 FLOWCRAFT DEBUG - WARUM NICHT ERREICHBAR?

## ❗ PROBLEM:
Script ausgeführt, aber `http://automat.owona.de/flowcraft/` ist nicht erreichbar.

## 🔍 DEBUG SCHRITTE:

### **1️⃣ SSH zum Server und Status prüfen:**
```bash
ssh root@automat.owona.de
```

### **2️⃣ Services Status prüfen:**
```bash
# PM2 Status
pm2 status

# Nginx Status
systemctl status nginx

# Ports prüfen
netstat -tlnp | grep -E ":3000|:5678|:80"

# Prozesse prüfen
ps aux | grep -E "node|nginx"
```

### **3️⃣ FlowCraft spezifisch prüfen:**
```bash
# FlowCraft Verzeichnis
ls -la /var/www/flowcraft/

# FlowCraft Logs
cd /var/www/flowcraft
pm2 logs flowcraft --lines 20

# Port 3000 direkt testen
curl -I http://localhost:3000
curl -I http://localhost:5678
```

### **4️⃣ Nginx Konfiguration prüfen:**
```bash
# Nginx Konfiguration anzeigen
cat /etc/nginx/sites-available/default

# Nginx Test
nginx -t

# Nginx Access/Error Logs
tail -20 /var/log/nginx/access.log
tail -20 /var/log/nginx/error.log
```

### **5️⃣ HÄUFIGE PROBLEME & FIXES:**

**Problem A: PM2 FlowCraft nicht gestartet**
```bash
cd /var/www/flowcraft
pm2 start npm --name "flowcraft" -- start
pm2 save
```

**Problem B: Port 3000 blockiert**
```bash
# Prüfen was auf Port 3000 läuft
lsof -i :3000
# Falls etwas anderes läuft, stoppen:
# kill -9 [PID]
```

**Problem C: Build-Fehler**
```bash
cd /var/www/flowcraft
npm run build
# Falls Fehler, Dependencies neu installieren:
rm -rf node_modules package-lock.json
npm install --production
npm run build
```

**Problem D: Environment-Fehler**
```bash
cd /var/www/flowcraft
cat .env.local
# Prüfen ob alle Environment-Variablen korrekt sind
```

**Problem E: Nginx Proxy-Fehler**
```bash
# Test ob FlowCraft auf localhost:3000 läuft
curl http://localhost:3000

# Falls ja, aber /flowcraft/ nicht funktioniert:
# Nginx Konfiguration neu laden
systemctl restart nginx
```

### **6️⃣ QUICK FIX - FlowCraft manuell starten:**
```bash
cd /var/www/flowcraft
pm2 delete flowcraft 2>/dev/null
npm run build
pm2 start npm --name "flowcraft" -- start
pm2 save

# Test
curl -I http://localhost:3000
echo "✅ FlowCraft Status geprüft"
```

### **7️⃣ ALTERNATIVE - Direkter Port Test:**
```bash
# FlowCraft temporär auf Port 8080 starten
cd /var/www/flowcraft
PORT=8080 pm2 start npm --name "flowcraft-test" -- start

# Test
curl -I http://localhost:8080
# Falls das funktioniert: Nginx Problem
# Falls das nicht funktioniert: FlowCraft Problem
```

## 🎯 **FÜHREN SIE DIESE SCHRITTE AUS:**

1. **SSH zum Server**
2. **Status prüfen** (Schritte 2-4)
3. **Problem identifizieren**
4. **Quick Fix** (Schritt 6)
5. **Ergebnis melden**

**Starten Sie mit den Debug-Schritten und teilen Sie die Ausgaben mit mir!** 🔍

