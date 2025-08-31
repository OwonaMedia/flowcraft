# 🚀 DEPLOYMENT READY - FINALE BEFEHLE

**Status:** FlowCraft komplett konfiguriert mit NextAuth + MCP Server

## ✅ **WAS ERSTELLT WURDE:**

### 🔐 **NextAuth.js Integration:**
- ✅ API Route: `app/api/auth/[...nextauth]/route.ts`
- ✅ Auth Config: `lib/auth.ts` (JWT Strategy für Production)
- ✅ Supabase Integration vorbereitet
- ✅ GDPR-konforme Session-Verwaltung

### 🤖 **MCP Server (Model Context Protocol):**
- ✅ Vollständiger MCP Server: `mcp-server/index.ts`
- ✅ 6 Bot-Management Tools implementiert
- ✅ Supabase Integration für Bot-Daten
- ✅ WhatsApp API Testing Simulation
- ✅ GDPR-konforme Analytics
- ✅ TypeScript + ES Modules

### 📱 **WhatsApp API Mock:**
- ✅ Test Endpoint: `app/api/whatsapp/test/route.ts`
- ✅ 360dialog API Simulation
- ✅ Phone Number Validation
- ✅ Mock Response für MCP Testing

## 🎯 **NÄCHSTE SCHRITTE AUF HETZNER SERVER:**

### **1️⃣ SOFORTIGE SERVER-COMMANDS:**
```bash
# 1. Aktuellen Code hochladen
cd /var/www/flowcraft
git pull origin main

# 2. Fehlerhafte Config entfernt (bereits getan lokal)
rm -f next.config.js

# 3. Dependencies installieren
npm install

# 4. MCP Server Dependencies
cd mcp-server
npm install
npm run build
cd ..

# 5. FlowCraft neu starten
pm2 restart flowcraft

# 6. Status prüfen
sleep 10
pm2 list
curl -I http://localhost:3001
curl -I http://localhost:3001/api/auth/session
```

### **2️⃣ MCP SERVER STARTEN:**
```bash
cd /var/www/flowcraft/mcp-server

# Production Build
npm run build

# Als Service starten (PM2)
pm2 start dist/index.js --name "flowcraft-mcp" --interpreter node

# MCP Server Status
pm2 list
pm2 logs flowcraft-mcp --lines 5
```

### **3️⃣ NGINX KONFIGURATION OPTIMIEREN:**
```bash
# NextAuth Cookie-freundliche Nginx Config
cat > /etc/nginx/sites-available/flowcraft << 'EOF'
server {
    listen 9000;
    server_name automat.owona.de;
    
    # NextAuth.js Cookie Support
    proxy_cookie_path / "/";
    proxy_cookie_domain localhost automat.owona.de;
    
    location /flowcraft/ {
        proxy_pass http://localhost:3001/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # NextAuth Headers
        proxy_set_header Cookie $http_cookie;
        proxy_pass_header Set-Cookie;
        
        # WebSocket Support (für Real-time Features)
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # Timeout Settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    location / {
        return 301 /flowcraft/;
    }
}
EOF

# Nginx neu laden
nginx -t
systemctl reload nginx
```

### **4️⃣ ENVIRONMENT VARIABLES SETZEN:**
```bash
cd /var/www/flowcraft

# Production Environment erweitern
cat >> .env.local << 'EOF'

# Google OAuth (für Production)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# NextAuth Configuration
NEXTAUTH_URL=http://automat.owona.de:9000/flowcraft
NEXTAUTH_SECRET=botchat-pro-super-secret-key-2024

# Enable Analytics
ENABLE_ANALYTICS=true

# Node Environment
NODE_ENV=production
EOF

pm2 restart flowcraft
```

## 🧪 **TESTING COMMANDS:**

### **NextAuth API Testing:**
```bash
# Session Endpoint
curl -I http://automat.owona.de:9000/flowcraft/api/auth/session

# Sign-in Page
curl -I http://automat.owona.de:9000/flowcraft/api/auth/signin

# CSRF Token
curl http://automat.owona.de:9000/flowcraft/api/auth/csrf
```

### **MCP Server Testing:**
```bash
# MCP Server direkt testen
cd /var/www/flowcraft/mcp-server
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list", "params": {}}' | node dist/index.js

# PM2 MCP Status
pm2 show flowcraft-mcp
pm2 logs flowcraft-mcp --lines 10
```

### **WhatsApp API Testing:**
```bash
# WhatsApp Test Endpoint
curl -X POST http://automat.owona.de:9000/flowcraft/api/whatsapp/test \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+49123456789",
    "message": "FlowCraft MCP Test erfolgreich! 🚀"
  }'

# WhatsApp Service Status
curl http://automat.owona.de:9000/flowcraft/api/whatsapp/test
```

## 📊 **ERWARTETE RESULTS:**

### ✅ **FlowCraft:**
- **GET /** → `200 OK` (Landing Page)
- **GET /api/auth/session** → `200 OK` (JSON Response)
- **Memory Usage:** ~20-30MB (normal)

### ✅ **MCP Server:**
- **PM2 Status:** `online`
- **Memory Usage:** ~15-20MB
- **Tools Available:** 6 Bot-Management Tools

### ✅ **WhatsApp API Mock:**
- **POST /api/whatsapp/test** → `200 OK` mit Mock Response
- **Phone Validation:** E.164 Format Required

## 🎉 **ERFOLGS-CHECKLIST:**

- [ ] FlowCraft läuft auf Port 3001
- [ ] NextAuth APIs antworten (200 OK)
- [ ] MCP Server läuft als PM2 Service
- [ ] WhatsApp Test API funktioniert
- [ ] Nginx Proxy auf Port 9000 aktiv
- [ ] n8n unberührt auf Port 80

## 🚨 **FALLBACK (falls Probleme):**
```bash
# Alles zurücksetzen
pm2 stop flowcraft flowcraft-mcp
pm2 delete flowcraft flowcraft-mcp

# Von vorne starten
cd /var/www/flowcraft
git checkout main
npm install
pm2 start npm --name flowcraft -- start
pm2 save
```

---

**🌟 FLOWCRAFT + MCP SERVER IST DEPLOYMENT-READY!** 🚀

**Nächster Schritt:** Server-Commands ausführen und testen.
