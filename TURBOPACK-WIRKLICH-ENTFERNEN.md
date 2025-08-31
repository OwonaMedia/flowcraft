# 🔧 TURBOPACK WIRKLICH ENTFERNEN

## ❗ PROBLEM IDENTIFIZIERT:
```
> next dev --turbopack
▲ Next.js 15.5.2 (Turbopack)
```

**Turbopack läuft IMMER NOCH! Der --turbopack Flag ist in package.json!**

## ✅ SOFORT-FIX:

### **1️⃣ Package.json prüfen und reparieren:**
```bash
cd /var/www/flowcraft

# Package.json anzeigen
cat package.json | grep -A 5 scripts

# --turbopack aus allen Scripts entfernen
sed -i 's/ --turbopack//g' package.json

# Prüfen ob entfernt
cat package.json | grep -A 5 scripts

echo "✅ Turbopack aus package.json entfernt"
```

### **2️⃣ FlowCraft neu starten:**
```bash
pm2 delete flowcraft

# OHNE --turbopack (jetzt wirklich!)
PORT=3001 pm2 start npm --name "flowcraft" -- run dev
pm2 save

# Status prüfen
pm2 status
sleep 15
curl -I http://localhost:3001
```

### **3️⃣ Logs prüfen - sollte OHNE Turbopack sein:**
```bash
pm2 logs flowcraft --lines 10

# Sollte zeigen:
# ▲ Next.js 15.5.2 (OHNE "(Turbopack)")
```

### **4️⃣ FALLS PACKAGE.JSON PROBLEMATISCH - MINIMAL ERSTELLEN:**
```bash
cd /var/www/flowcraft

# Backup
cp package.json package.json.backup

# Komplett neue package.json OHNE --turbopack
cat > package.json << 'EOF'
{
  "name": "flowcraft",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "15.5.2",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "typescript": "^5"
  }
}
EOF

# Dependencies neu installieren
npm install

# FlowCraft neu starten
pm2 delete flowcraft
PORT=3001 pm2 start npm --name "flowcraft" -- run dev
pm2 save

sleep 15
curl -I http://localhost:3001
```

### **5️⃣ ALTERNATIVE - NEXT.JS 14 (OHNE Turbopack):**
```bash
cd /var/www/flowcraft

# Next.js 14 downgrade (stabiler)
npm install next@14.2.5 --save

# Restart
pm2 restart flowcraft
sleep 15
curl -I http://localhost:3001
```

## 🎯 **ERWARTETES ERGEBNIS:**

**Logs sollten zeigen:**
```
▲ Next.js 15.5.2 (OHNE Turbopack)
oder
▲ Next.js 14.2.5
```

**NICHT:**
```
▲ Next.js 15.5.2 (Turbopack) ❌
```

## 🚀 **NACH DEM FIX:**

Sobald Turbopack WIRKLICH weg ist:
```
✅ HTTP/1.1 200 OK
✅ FlowCraft funktioniert!
```

**FÜHREN SIE SCHRITT 1-2 AUS!** 🔧

