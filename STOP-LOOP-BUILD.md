# 🛑 LOOP STOPPEN UND BUILD ERSTELLEN

## 🚨 AKTUELLER STATUS:
FlowCraft ist in einem endlosen Restart-Loop wegen fehlendem Build!

## ✅ SOFORTIGER STOP UND FIX:

### **1️⃣ LOOP SOFORT STOPPEN:**
```bash
# FlowCraft komplett stoppen
pm2 stop flowcraft
pm2 delete flowcraft

# Status prüfen (sollte leer sein)
pm2 status

echo "✅ Loop gestoppt"
```

### **2️⃣ BUILD ERSTELLEN:**
```bash
cd /var/www/flowcraft

# Environment prüfen
cat .env.local

# Clean Build
rm -rf .next node_modules package-lock.json

# Dependencies neu installieren
npm install --production

# Build erstellen
npm run build

# Prüfen ob Build erfolgreich
ls -la .next/

echo "✅ Build erstellt"
```

### **3️⃣ FLOWCRAFT MIT BUILD STARTEN:**
```bash
cd /var/www/flowcraft

# Mit Production Build starten
PORT=3001 pm2 start npm --name "flowcraft" -- start
pm2 save

# Status prüfen
pm2 status

# Logs prüfen (sollte jetzt "Ready" zeigen)
pm2 logs flowcraft --lines 10

echo "✅ FlowCraft gestartet"
```

### **4️⃣ TEST:**
```bash
# Warten bis vollständig gestartet
sleep 10

# Testen
curl -I http://localhost:3001

# Falls erfolgreich:
echo "🎉 FlowCraft läuft auf Port 3001!"
```

### **5️⃣ FALLS BUILD FEHLER - DEVELOPMENT MODE:**
```bash
# Alternative: Development Mode (braucht keinen Build)
cd /var/www/flowcraft
pm2 delete flowcraft

# Development starten
PORT=3001 pm2 start npm --name "flowcraft" -- run dev
pm2 save

# Test
sleep 15
curl -I http://localhost:3001

echo "✅ Development Mode läuft"
```

## 🎯 **WICHTIG:**
- **ERST** den Loop stoppen
- **DANN** Build erstellen  
- **DANACH** neu starten

**FÜHREN SIE DIE SCHRITTE 1-4 GENAU IN DIESER REIHENFOLGE AUS!** 🔧

