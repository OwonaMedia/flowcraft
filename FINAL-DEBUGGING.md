# 🔍 FINAL DEBUGGING - HTTP 500 LÖSEN

## ✅ FORTSCHRITT:
- FlowCraft: Online (21.7mb) ✅
- ETag geändert: Neue Kompilierung ✅
- Turbopack: Wahrscheinlich weg ✅
- Problem: HTTP 500 bleibt ❌

## 🔍 LOGS PRÜFEN (OHNE TURBOPACK):

### **1️⃣ Neue Logs anschauen:**
```bash
pm2 logs flowcraft --lines 10
```

### **2️⃣ WENN IMMER NOCH TURBOPACK - PACKAGE.JSON KOMPLETT NEU:**
```bash
cd /var/www/flowcraft

# Aktuelle package.json anzeigen
cat package.json

# Komplett neue package.json (GARANTIERT ohne Turbopack)
cat > package.json << 'EOF'
{
  "name": "flowcraft",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "14.2.5",
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

# Next.js 14 installieren (stabiler)
npm install

# Restart
pm2 delete flowcraft
PORT=3001 pm2 start npm --name "flowcraft" -- run dev
pm2 save

sleep 20
curl -I http://localhost:3001
```

### **3️⃣ MINIMAL APP STRUCTURE:**
```bash
cd /var/www/flowcraft

# Alle komplexen Ordner temporär entfernen
mkdir -p /tmp/flowcraft-backup
mv components /tmp/flowcraft-backup/ 2>/dev/null
mv lib /tmp/flowcraft-backup/ 2>/dev/null
mv app/dashboard /tmp/flowcraft-backup/ 2>/dev/null
mv app/api /tmp/flowcraft-backup/ 2>/dev/null

# Super minimal layout
cat > app/layout.tsx << 'EOF'
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
EOF

# Super minimal page
cat > app/page.tsx << 'EOF'
export default function Home() {
  return (
    <div style={{padding: '20px'}}>
      <h1>FlowCraft Works!</h1>
      <p>Minimal Next.js App</p>
    </div>
  )
}
EOF

# Minimal globals.css
cat > app/globals.css << 'EOF'
body {
  margin: 0;
  font-family: Arial, sans-serif;
}
EOF

# Restart
pm2 restart flowcraft
sleep 15
curl -I http://localhost:3001
```

### **4️⃣ FRESH NEXT.JS 14 (ULTIMA RATIO):**
```bash
cd /var/www

# Backup
mv flowcraft flowcraft-problematic

# Fresh Next.js 14 ohne Probleme
npx create-next-app@14.2.5 flowcraft --typescript --no-tailwind --no-eslint --app --no-src-dir

cd flowcraft

# Environment
cat > .env.local << 'EOF'
NEXTAUTH_URL="http://automat.owona.de:3001"
NODE_ENV="development"
EOF

# Test page
cat > app/page.tsx << 'EOF'
export default function Home() {
  return (
    <div style={{padding: '40px', textAlign: 'center'}}>
      <h1 style={{color: 'green'}}>🎉 FlowCraft SUCCESS!</h1>
      <p>Fresh Next.js 14 installation works!</p>
      <p>Port: 3001</p>
      <p>Date: {new Date().toLocaleString()}</p>
    </div>
  )
}
EOF

# Start
PORT=3001 pm2 start npm --name "flowcraft" -- run dev
pm2 save

sleep 20
curl -I http://localhost:3001
```

## 🎯 **DEBUGGING REIHENFOLGE:**
1. **Logs prüfen** (Schritt 1)
2. **Next.js 14** (Schritt 2)
3. **Minimal app** (Schritt 3)
4. **Fresh install** (Schritt 4)

## 🚀 **ZIEL:**
**HTTP/1.1 200 OK** von `http://localhost:3001`

**STARTEN SIE MIT SCHRITT 1: `pm2 logs flowcraft --lines 10`** 🔍

