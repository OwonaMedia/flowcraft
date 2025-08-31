# 🌐 FlowCraft Production Environment für owona.de

## ✅ **READY-TO-USE Environment Variables für owona.de Server**

```env
# ===== SUPABASE BACKEND (botchat-pro EU-Frankfurt) =====
SUPABASE_URL="https://ddavuntesnxtyikvmkje.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkYXZ1bnRlc254dHlpa3Zta2plIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NzgyODgsImV4cCI6MjA3MjE1NDI4OH0.BIY4-aQZOsodKF2Nbpg0byKLDolemR96SjoVEe3GMcs"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkYXZ1bnRlc254dHlpa3Zta2plIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjU3ODI4OCwiZXhwIjoyMDcyMTU0Mjg4fQ.HfBZzrvOSAbk5Nve6MZSjYkLnQ2h8un3NPiok0z8YXA"

# ===== DATABASE CONNECTION =====
DATABASE_URL="postgresql://postgres:Afidi2008!@db.ddavuntesnxtyikvmkje.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:Afidi2008!@db.ddavuntesnxtyikvmkje.supabase.co:5432/postgres"

# ===== PRODUCTION SETTINGS =====
NEXTAUTH_URL="https://owona.de"
NEXTAUTH_SECRET="flowcraft-production-secret-32-chars-minimum-secure-key"
NODE_ENV="production"

# ===== PUBLIC KEYS (für Frontend) =====
NEXT_PUBLIC_SUPABASE_URL="https://ddavuntesnxtyikvmkje.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkYXZ1bnRlc254dHlpa3Zta2plIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NzgyODgsImV4cCI6MjA3MjE1NDI4OH0.BIY4-aQZOsodKF2Nbpg0byKLDolemR96SjoVEe3GMcs"
NEXT_PUBLIC_APP_URL="https://owona.de"

# ===== OPTIONAL (können später hinzugefügt werden) =====
# Google OAuth (für Benutzer-Anmeldung)
# GOOGLE_CLIENT_ID="[für owona.de Domain konfigurieren]"
# GOOGLE_CLIENT_SECRET="[Google OAuth Secret]"

# Stripe (für Payments)
# STRIPE_PUBLISHABLE_KEY="pk_live_[LIVE-KEY]" 
# STRIPE_SECRET_KEY="sk_live_[LIVE-KEY]"

# WhatsApp Business API
# WHATSAPP_API_URL="https://waba-v2.360dialog.io"
# WHATSAPP_API_TOKEN="[PRODUCTION-TOKEN]"

# Debug/Logging
ENABLE_DEBUG_LOGS="false"
DATA_RETENTION_DAYS="90"
```

## 🚀 **Deployment auf owona.de Server**

### Option 1: SSH Deployment
```bash
# Environment Variables auf Server setzen
ssh root@automat.owona.de

# In Server Terminal:
cd /path/to/flowcraft
nano .env.local  # Kopiere obige Environment Variables

# App neu starten
pm2 restart flowcraft
# oder
npm run build && npm start
```

### Option 2: Docker Environment
```bash
# Falls Docker verwendet wird
docker run -d \
  --name flowcraft \
  -p 3000:3000 \
  -e SUPABASE_URL="https://ddavuntesnxtyikvmkje.supabase.co" \
  -e SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -e DATABASE_URL="postgresql://postgres:Afidi2008!@db.ddavuntesnxtyikvmkje.supabase.co:5432/postgres" \
  -e NEXTAUTH_URL="https://owona.de" \
  -e NODE_ENV="production" \
  flowcraft:latest
```

## 🔧 **Supabase Domain Konfiguration**

### Supabase Dashboard Settings
Gehen Sie zu: https://supabase.com/dashboard/project/ddavuntesnxtyikvmkje/auth/url-configuration

**Site URL:** `https://owona.de`

**Additional Redirect URLs:**
```
https://owona.de/api/auth/callback/google
https://owona.de/dashboard
https://owona.de/auth/callback
```

## 🧪 **Nach Deployment testen**

1. **Frontend Test:** https://owona.de
2. **Demo Modus:** https://owona.de/demo
3. **Database Check:** Dashboard sollte ohne Fehler laden
4. **API Test:** https://owona.de/api/bots (sollte JSON zurückgeben)

## ⚠️ **Wichtige Sicherheitshinweise**

- ✅ **NEXTAUTH_SECRET** muss für Production geändert werden
- ✅ **SUPABASE_SERVICE_ROLE_KEY** niemals im Frontend exponieren  
- ✅ Nur **NEXT_PUBLIC_*** Keys sind im Browser sichtbar
- ✅ **DATABASE_URL** enthält Passwort - sicher speichern

## 🚨 **Troubleshooting**

### Problem: "Database connection failed"
```bash
# Test auf Server
curl -X POST https://owona.de/api/bots
# Sollte Authentifizierungsfehler geben (nicht Connection Error)
```

### Problem: "Invalid JWT"
- ✅ Prüfe SUPABASE_ANON_KEY ist korrekt kopiert
- ✅ Keine Leerzeichen am Anfang/Ende

### Problem: "CORS Error"
- ✅ Supabase Site URL auf `https://owona.de` setzen

---

**🎯 Mit diesen Settings ist FlowCraft production-ready auf owona.de!**
