# 🔧 NEXT.JS BUILD FEHLT - SOFORTFIX

## ❗ PROBLEM:
```
Error: Could not find a production build in the '.next' directory. Try building your app with 'next build'
```

## ✅ SOFORTLÖSUNG:

### **1️⃣ FlowCraft stoppen und Build erstellen:**
```bash
# FlowCraft stoppen
pm2 stop flowcraft

# Ins Verzeichnis wechseln
cd /var/www/flowcraft

# Dependencies prüfen/installieren
npm install --production

# Production Build erstellen
npm run build

# Status prüfen
ls -la .next/
```

### **2️⃣ FlowCraft neu starten:**
```bash
# FlowCraft mit Build starten
PORT=3001 pm2 restart flowcraft

# Oder komplett neu starten:
pm2 delete flowcraft
PORT=3001 pm2 start npm --name "flowcraft" -- start
pm2 save

# Status prüfen
pm2 status
pm2 logs flowcraft --lines 10
```

### **3️⃣ Test:**
```bash
# Warten bis gestartet
sleep 5

# Testen
curl -I http://localhost:3001

# Logs prüfen
pm2 logs flowcraft --lines 5
```

### **4️⃣ Falls Build-Fehler auftreten:**
```bash
cd /var/www/flowcraft

# Environment prüfen
cat .env.local

# Node.js Version prüfen
node --version
npm --version

# Clean Build
rm -rf .next node_modules package-lock.json
npm install --production
npm run build

echo "✅ Clean Build erstellt"
```

### **5️⃣ Development Mode (Alternative):**
```bash
# Falls Production Build Probleme macht:
cd /var/www/flowcraft
pm2 delete flowcraft

# Development Mode starten (funktioniert ohne Build)
PORT=3001 pm2 start npm --name "flowcraft" -- run dev
pm2 save

# Test
sleep 10
curl -I http://localhost:3001
```

## 🎯 **WARUM DAS PASSIERT:**

Next.js braucht einen **Production Build** (`npm run build`) bevor `next start` funktioniert. Das automatische Script hat den Build übersprungen oder es gab Fehler.

## 🚀 **NACH DEM FIX:**

**FlowCraft läuft dann stabil auf Port 3001** und Sie können die Nginx-Konfiguration fortsetzen.

**FÜHREN SIE SCHRITT 1-3 AUS!** 🔧

