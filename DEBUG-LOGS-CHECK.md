# 🔍 DEBUG LOGS PRÜFEN

## ✅ STATUS:
- Environment: Vollständig ✅
- Simple Page: Erstellt ✅  
- Memory: 16.3mb (lädt) ✅
- Problem: HTTP 500 bleibt ❌

## 🔍 LOGS PRÜFEN:

### **1️⃣ Error Logs anschauen:**
```bash
pm2 logs flowcraft --lines 30
```

### **2️⃣ SUPER MINIMAL TEST:**
```bash
cd /var/www/flowcraft

# Layout vereinfachen (häufige Ursache für 500)
cat > app/layout.tsx << 'EOF'
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
EOF

# Restart
pm2 restart flowcraft --update-env
sleep 10
curl -I http://localhost:3001
```

### **3️⃣ FALLS IMMER NOCH 500 - COMPONENTS ENTFERNEN:**
```bash
cd /var/www/flowcraft

# Backup komplexer Ordner
mkdir -p /tmp/flowcraft-backup
mv components /tmp/flowcraft-backup/ 2>/dev/null
mv lib /tmp/flowcraft-backup/ 2>/dev/null
mv app/dashboard /tmp/flowcraft-backup/ 2>/dev/null
mv app/api /tmp/flowcraft-backup/ 2>/dev/null

# Nur minimal structure
ls app/

# Restart
pm2 restart flowcraft --update-env
sleep 10
curl -I http://localhost:3001
```

### **4️⃣ NEXT.JS CONFIG VEREINFACHEN:**
```bash
cd /var/www/flowcraft

# Minimal Next.js Config
cat > next.config.ts << 'EOF'
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverComponentsExternalPackages: [],
  }
};

export default nextConfig;
EOF

# Restart
pm2 restart flowcraft --update-env
sleep 10
curl -I http://localhost:3001
```

### **5️⃣ PACKAGE.JSON PRÜFEN:**
```bash
cd /var/www/flowcraft

# Dependencies prüfen
cat package.json | grep -A 10 '"dependencies"'

# Node/NPM Version
node --version
npm --version
```

### **6️⃣ FALLS ALLES FEHLSCHLÄGT - CREATE NEXT APP:**
```bash
cd /var/www

# Backup
mv flowcraft flowcraft-backup

# Fresh Next.js App
npx create-next-app@latest flowcraft --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"

cd flowcraft

# Environment kopieren
cp ../flowcraft-backup/.env.local .

# Port 3001 starten
PORT=3001 pm2 start npm --name "flowcraft" -- run dev
pm2 save

sleep 15
curl -I http://localhost:3001
```

## 🎯 **DEBUGGING REIHENFOLGE:**
1. **Logs prüfen** (Schritt 1) - Zeigt exakten Fehler
2. **Layout vereinfachen** (Schritt 2)
3. **Components entfernen** (Schritt 3)
4. **Config vereinfachen** (Schritt 4)
5. **Fresh install** (Schritt 6)

**STARTEN SIE MIT: `pm2 logs flowcraft --lines 30`** 🔍

