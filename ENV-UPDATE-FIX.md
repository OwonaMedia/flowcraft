# 🔧 ENVIRONMENT VARIABLES UPDATE

## ❗ PROBLEM:
PM2 Warnung: `Use --update-env to update environment variables`

## ✅ SOFORT-FIX:

### **1️⃣ Environment Datei neu erstellen:**
```bash
cd /var/www/flowcraft

# Korrekte Environment für Port 3001
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

echo "✅ Environment aktualisiert"
```

### **2️⃣ PM2 mit neuen Environment Variables starten:**
```bash
# FlowCraft stoppen
pm2 delete flowcraft

# Mit neuen ENV-Variablen starten
PORT=3001 pm2 start npm --name "flowcraft" -- run dev
pm2 save

echo "✅ FlowCraft mit neuen Environment Variables gestartet"
```

### **3️⃣ Test:**
```bash
# Warten bis gestartet
sleep 15

# Test
curl -I http://localhost:3001

# Logs prüfen
pm2 logs flowcraft --lines 10
```

### **4️⃣ Wenn immer noch 500 Error - Minimal Test:**
```bash
cd /var/www/flowcraft

# Einfachste Test-Page
mkdir -p app/test
cat > app/test/page.tsx << 'EOF'
export default function TestPage() {
  return (
    <div style={{padding: '20px'}}>
      <h1>FlowCraft Test</h1>
      <p>Next.js läuft!</p>
      <p>Environment: {process.env.NODE_ENV}</p>
      <p>Port: 3001</p>
    </div>
  );
}
EOF

# Restart
pm2 restart flowcraft --update-env
sleep 10

# Test Page testen
curl -I http://localhost:3001/test
```

### **5️⃣ Debug mit Browser:**
```bash
# Environment prüfen
cat .env.local

# PM2 Status
pm2 status

# Detaillierte Logs
pm2 logs flowcraft --lines 50

echo "🔍 Debug Info bereit"
```

## 🎯 **WICHTIGE ÄNDERUNGEN:**

- **NEXTAUTH_URL:** `http://automat.owona.de:3001` (Port 3001!)
- **NODE_ENV:** `development` (weniger strikt)

## 🚀 **NACH DEM FIX:**

Sobald `curl -I http://localhost:3001` **HTTP 200** zeigt:

```bash
# Nginx für funktionierendes FlowCraft konfigurieren
systemctl restart nginx
curl -I http://automat.owona.de/flowcraft/
```

**FÜHREN SIE SCHRITTE 1-3 AUS!** 🔧

