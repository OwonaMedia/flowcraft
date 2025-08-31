# 🔧 SYSTEMATISCHE HTTP 500 LÖSUNG

## ✅ STATUS:
- FlowCraft: Online (3.3mb) ✅
- Turbopack: Deaktiviert ✅
- Problem: HTTP 500 bleibt ❌

## 🔍 SCHRITT-FÜR-SCHRITT DEBUGGING:

### **1️⃣ LOGS OHNE TURBOPACK PRÜFEN:**
```bash
pm2 logs flowcraft --lines 20
```

### **2️⃣ SUPER MINIMAL APP ERSTELLEN:**
```bash
cd /var/www/flowcraft

# Alle komplexen Dateien backup
mkdir -p /tmp/backup-flowcraft
mv app/dashboard /tmp/backup-flowcraft/ 2>/dev/null
mv app/api /tmp/backup-flowcraft/ 2>/dev/null
mv components /tmp/backup-flowcraft/ 2>/dev/null
mv lib /tmp/backup-flowcraft/ 2>/dev/null
mv types /tmp/backup-flowcraft/ 2>/dev/null

# Minimal app structure
cat > app/layout.tsx << 'EOF'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
EOF

cat > app/page.tsx << 'EOF'
export default function Home() {
  return (
    <div style={{padding: '20px', fontFamily: 'Arial'}}>
      <h1>FlowCraft Test</h1>
      <p>Minimal Next.js App</p>
    </div>
  )
}
EOF

# Minimal globals.css
cat > app/globals.css << 'EOF'
* {
  box-sizing: border-box;
}

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

### **3️⃣ FALLS IMMER NOCH 500 - NEXT.JS CONFIG LÖSCHEN:**
```bash
cd /var/www/flowcraft

# Next.js Config backup und löschen
mv next.config.ts next.config.ts.backup 2>/dev/null
mv next.config.js next.config.js.backup 2>/dev/null

# Restart
pm2 restart flowcraft
sleep 10
curl -I http://localhost:3001
```

### **4️⃣ FALLS IMMER NOCH 500 - PACKAGE.JSON MINIMAL:**
```bash
cd /var/www/flowcraft

# Minimal package.json
cat > package.json << 'EOF'
{
  "name": "flowcraft-minimal",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "14.2.5",
    "react": "^18",
    "react-dom": "^18"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "typescript": "^5"
  }
}
EOF

# Clean install
rm -rf node_modules package-lock.json
npm install

# Restart
pm2 delete flowcraft
PORT=3001 pm2 start npm --name "flowcraft" -- run dev
pm2 save

sleep 20
curl -I http://localhost:3001
```

### **5️⃣ LETZTE OPTION - FRESH NEXT.JS 14:**
```bash
cd /var/www

# Komplett neues Next.js 14 Projekt
rm -rf flowcraft
npx create-next-app@14.2.5 flowcraft --typescript --no-tailwind --no-eslint --app --no-src-dir

cd flowcraft

# Environment kopieren
cat > .env.local << 'EOF'
DATABASE_URL="postgresql://postgres:Afidi2008!@db.ddavuntesnxtyikvmkje.supabase.co:5432/postgres"
NEXTAUTH_SECRET="botchat-pro-super-secret-key-2024"
NEXTAUTH_URL="http://automat.owona.de:3001"
NEXT_PUBLIC_SUPABASE_URL="https://ddavuntesnxtyikvmkje.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkYXZ1bnRlc254dHlpa3Zta2plIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NzgyODgsImV4cCI6MjA3MjE1NDI4OH0.BIY4-aQZOsodKF2Nbpg0byKLDolemR96SjoVEe3GMcs"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkYXZ1bnRlc254dHlpa3Zta2plIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjU3ODI4OCwiZXhwIjoyMDcyMTU0Mjg4fQ.HfBZzrvOSAbk5Nve6MZSjYkLnQ2h8un3NPiok0z8YXA"
GDPR_MODE="true"
NODE_ENV="development"
EOF

# Test page
cat > app/page.tsx << 'EOF'
export default function Home() {
  return (
    <div style={{padding: '20px'}}>
      <h1>🎉 FlowCraft is Working!</h1>
      <p>Fresh Next.js 14 installation</p>
      <p>Port: 3001</p>
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

## 🎯 **REIHENFOLGE:**
1. **Logs prüfen** (Schritt 1)
2. **Minimal app** (Schritt 2)
3. **Config löschen** (Schritt 3)
4. **Package minimal** (Schritt 4)
5. **Fresh install** (Schritt 5)

**STARTEN SIE MIT SCHRITT 1: `pm2 logs flowcraft --lines 20`** 🔍

