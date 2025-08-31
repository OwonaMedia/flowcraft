# 🚨 FLOWCRAFT CRASH REPARIEREN

## ❌ **PROBLEM:** FlowCraft crashed nach NextAuth API Route

## 🔍 **DIAGNOSE:**

### **1️⃣ PM2 LOGS PRÜFEN:**
```bash
# Crash Logs anzeigen
pm2 logs flowcraft --lines 10

# Error Logs
pm2 logs flowcraft --err --lines 5

# Process Details
pm2 show flowcraft
```

### **2️⃣ SYNTAX ERRORS FINDEN:**
```bash
cd /var/www/flowcraft

# Next.js syntax check
npm run build 2>&1 | head -20

# TypeScript check
npx tsc --noEmit 2>&1 | head -10

# File contents prüfen
cat app/api/auth/[...nextauth]/route.ts
cat next.config.js
```

## ⚡ **SOFORTIGE REPARATUR:**

### **A) PROBLEMATISCHE DATEIEN ENTFERNEN:**
```bash
cd /var/www/flowcraft

# NextAuth Route temporär entfernen
rm -rf app/api/auth/[...nextauth]/

# Next.config temporär entfernen
rm -f next.config.js

# PM2 restart
pm2 restart flowcraft

# Test
sleep 10
curl -I http://localhost:3001
```

### **B) MINIMALE NEXTAUTH ROUTE (EINFACHER):**
```bash
cd /var/www/flowcraft

# Einfachere NextAuth Route
mkdir -p app/api/auth/[...nextauth]
cat > app/api/auth/[...nextauth]/route.ts << 'EOF'
export async function GET() {
  return Response.json({ message: "NextAuth placeholder" })
}

export async function POST() {
  return Response.json({ message: "NextAuth placeholder" })
}
EOF

# PM2 restart
pm2 restart flowcraft
sleep 10
curl -I http://localhost:3001
```

### **C) BACKUP WIEDERHERSTELLEN:**
```bash
cd /var/www/flowcraft

# Alle neuen Dateien entfernen
rm -rf app/api/auth/
rm -f next.config.js

# PM2 restart
pm2 restart flowcraft

# Status prüfen
pm2 list
curl -I http://localhost:3001
```

## 🚀 **QUICK FIX:**
```bash
cd /var/www/flowcraft

# Alles entfernen was Probleme macht
rm -rf app/api/auth/
rm -f next.config.js

# Restart
pm2 restart flowcraft

# Warten und testen
sleep 15
pm2 list
curl -I http://localhost:3001
```

## 🎯 **ERWARTUNG:**
**FlowCraft startet wieder mit normaler Memory (20mb+)**

**STARTEN SIE MIT: `pm2 logs flowcraft --lines 10`** 🔍

