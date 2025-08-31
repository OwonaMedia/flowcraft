# 🔧 HTTP 500 ERROR - DEBUG UND FIX

## ✅ STATUS:
- **FlowCraft:** Online (23.7mb)
- **Port 3001:** Erreichbar
- **Problem:** HTTP 500 Internal Server Error

## 🔍 DEBUG SCHRITTE:

### **1️⃣ LOGS PRÜFEN:**
```bash
# FlowCraft Error Logs anschauen
pm2 logs flowcraft --lines 30

# Supabase Connection testen
curl -I https://ddavuntesnxtyikvmkje.supabase.co

# Environment prüfen
cd /var/www/flowcraft
cat .env.local
```

### **2️⃣ HÄUFIGE URSACHEN - FIXES:**

**Problem A: Supabase Connection**
```bash
cd /var/www/flowcraft

# Environment neu erstellen
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

# FlowCraft neu starten
pm2 restart flowcraft
sleep 10
curl -I http://localhost:3001
```

**Problem B: Prisma Connection**
```bash
cd /var/www/flowcraft

# Prisma neu generieren
npx prisma generate

# Database connection testen
npx prisma db push

# FlowCraft restart
pm2 restart flowcraft
sleep 10
curl -I http://localhost:3001
```

**Problem C: Next.js Config Problem**
```bash
cd /var/www/flowcraft

# Next.js Config prüfen
cat next.config.ts

# Temporär einfache Config
cat > next.config.ts << 'EOF'
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
EOF

# Restart
pm2 restart flowcraft
sleep 10
curl -I http://localhost:3001
```

### **3️⃣ SIMPLE TEST PAGE:**
```bash
cd /var/www/flowcraft

# Einfache Test-Page erstellen
mkdir -p app/test
cat > app/test/page.tsx << 'EOF'
export default function TestPage() {
  return (
    <div>
      <h1>FlowCraft Test Page</h1>
      <p>Wenn Sie das sehen, läuft Next.js!</p>
    </div>
  );
}
EOF

# FlowCraft restart
pm2 restart flowcraft
sleep 10

# Test Page testen
curl -I http://localhost:3001/test
```

### **4️⃣ MINIMAL FUNKTIONS-TEST:**
```bash
# Falls alles andere fehlschlägt - minimale Page
cd /var/www/flowcraft

# Backup main page
mv app/page.tsx app/page.tsx.backup 2>/dev/null

# Einfachste Page
cat > app/page.tsx << 'EOF'
export default function Home() {
  return <div><h1>FlowCraft Works!</h1></div>;
}
EOF

# Restart
pm2 restart flowcraft
sleep 10
curl -I http://localhost:3001
```

## 🎯 **NACH DEM FIX:**

Sobald `curl -I http://localhost:3001` **HTTP 200** zeigt:

### **5️⃣ NGINX KONFIGURIEREN:**
```bash
# Nginx für funktionales FlowCraft
systemctl restart nginx

# Final test
curl -I http://automat.owona.de/flowcraft/
```

## 📋 **DEBUGGING REIHENFOLGE:**
1. **Logs prüfen** (Schritt 1)
2. **Environment fix** (Problem A)
3. **Prisma fix** (Problem B)
4. **Config fix** (Problem C)
5. **Simple test** (Schritt 3)

**STARTEN SIE MIT SCHRITT 1: `pm2 logs flowcraft --lines 30`** 🔍

