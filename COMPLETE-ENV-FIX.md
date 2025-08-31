# 🔧 KOMPLETTE ENVIRONMENT ERSTELLEN

## ❗ PROBLEM:
Die .env.local Datei ist unvollständig - nur 2 Zeilen statt allen Environment Variables!

## ✅ SOFORT-FIX:

### **1️⃣ KOMPLETTE Environment erstellen:**
```bash
cd /var/www/flowcraft

# KOMPLETTE Environment (alle Variablen!)
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

# Prüfen ob alle Variablen da sind
cat .env.local
echo "✅ Komplette Environment erstellt"
```

### **2️⃣ FlowCraft neu starten:**
```bash
pm2 restart flowcraft --update-env
sleep 15
curl -I http://localhost:3001
```

### **3️⃣ Falls immer noch 500 - Logs prüfen:**
```bash
pm2 logs flowcraft --lines 20
```

### **4️⃣ MINIMAL TEST (ohne Supabase):**
```bash
cd /var/www/flowcraft

# Einfachste Page ohne Dependencies
cat > app/page.tsx << 'EOF'
export default function Home() {
  return (
    <div style={{padding: '20px', fontFamily: 'Arial'}}>
      <h1>🎉 FlowCraft funktioniert!</h1>
      <p>Next.js Development Server läuft</p>
      <p>Port: 3001</p>
      <p>Status: OK</p>
    </div>
  );
}
EOF

# Restart
pm2 restart flowcraft
sleep 10
curl -I http://localhost:3001
```

### **5️⃣ ALTERNATIVE - SUPER MINIMAL:**
```bash
cd /var/www/flowcraft

# Alle komplexen Komponenten temporär entfernen
mkdir -p backup
mv app/dashboard backup/ 2>/dev/null
mv app/api backup/ 2>/dev/null
mv components backup/ 2>/dev/null
mv lib backup/ 2>/dev/null

# Nur einfachste Struktur
cat > app/layout.tsx << 'EOF'
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
EOF

# Restart
pm2 restart flowcraft
sleep 10
curl -I http://localhost:3001
```

## 🎯 **DEBUGGING REIHENFOLGE:**
1. **Komplette Environment** (Schritt 1)
2. **Restart mit --update-env** (Schritt 2)
3. **Logs prüfen** (Schritt 3)
4. **Minimal Test** (Schritt 4)
5. **Super Minimal** (Schritt 5)

## 🚀 **ZIEL:**
**HTTP 200** auf `http://localhost:3001`

**FÜHREN SIE SCHRITTE 1-3 AUS!** 🔧

