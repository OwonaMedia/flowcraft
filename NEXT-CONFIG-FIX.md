# 🔧 NEXT.CONFIG.JS FEHLER BEHEBEN

## ✅ **FLOWCRAFT LÄUFT:** Ready in 1769ms, Network: 91.99.232.126:3001

## ❌ **PROBLEM:** `Unrecognized key(s): 'allowedDevOrigins'`

## ⚡ **SOFORTIGE LÖSUNG:**

### **1️⃣ NEXT.CONFIG.JS KORRIGIEREN:**
```bash
cd /var/www/flowcraft

# Korrekte Next.js 15 Config (allowedDevOrigins ist experimental.trustedHosts)
cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    trustedHosts: ['91.99.232.126', 'automat.owona.de', 'localhost']
  }
}

module.exports = nextConfig
EOF

# PM2 restart
pm2 restart flowcraft
```

### **2️⃣ ALTERNATIV - NEXT.CONFIG.JS ENTFERNEN:**
```bash
cd /var/www/flowcraft

# Config temporär entfernen (Cross-origin warnings ignorieren)
rm -f next.config.js

# PM2 restart
pm2 restart flowcraft
```

### **3️⃣ MINIMALE CONFIG:**
```bash
cd /var/www/flowcraft

# Sehr minimale Config
cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = nextConfig
EOF

# PM2 restart
pm2 restart flowcraft
```

## 🚀 **QUICK TEST:**
```bash
cd /var/www/flowcraft

# Config entfernen (einfachste Lösung)
rm -f next.config.js

# Restart
pm2 restart flowcraft

# Warten und testen
sleep 10
curl -I http://localhost:3001
curl -I http://91.99.232.126:3001
```

## 🎯 **ERWARTUNG:**
- **FlowCraft:** Läuft weiterhin
- **Warnings:** Verschwinden oder werden ignoriert
- **HTTP 200:** Funktioniert extern

## 📱 **DANN TESTEN:**
```
http://91.99.232.126:3001
```

**Cross-origin warnings sind nicht kritisch - FlowCraft sollte funktionieren!**

**STARTEN SIE MIT: `rm -f next.config.js && pm2 restart flowcraft`** 🚀

