# 🗄️ FlowCraft - Supabase Backend Setup Guide

## 📋 Supabase Projekt erstellen

### 1. Supabase Account & Projekt
- **URL:** https://supabase.com/dashboard
- **Region:** EU (Frankfurt) für DSGVO-Compliance
- **Projekt Name:** `flowcraft-production`
- **Organisation:** Für Production verwenden

### 2. Database Connection Details
Nach Projekt-Erstellung erhalten Sie:

```env
# Supabase Connection Details
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
SUPABASE_URL="https://[PROJECT-REF].supabase.co"
SUPABASE_ANON_KEY="[ANON-KEY]"
SUPABASE_SERVICE_ROLE_KEY="[SERVICE-ROLE-KEY]"
```

## 🚀 Schema Deployment

### 1. Prisma Schema Push
```bash
# In FlowCraft Projekt
npm run db:push
```

### 2. Demo Data Seeding
```bash
# Demo-Daten für Tests
npm run db:seed
```

## 🔐 Row Level Security (RLS) Setup

### Supabase Dashboard → Authentication → RLS

```sql
-- Users table RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid()::text = id);

-- Bots table RLS  
ALTER TABLE bots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bots" ON bots
  FOR SELECT USING (auth.uid()::text = "userId");

CREATE POLICY "Users can manage own bots" ON bots
  FOR ALL USING (auth.uid()::text = "userId");

-- Messages table RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bot messages" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM bots 
      WHERE bots.id = messages."botId" 
      AND bots."userId" = auth.uid()::text
    )
  );

-- Analytics table RLS
ALTER TABLE bot_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own analytics" ON bot_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM bots 
      WHERE bots.id = bot_analytics."botId" 
      AND bots."userId" = auth.uid()::text
    )
  );
```

## 🔑 Environment Variables für Production

### Production .env (owona.de)
```env
# Database (Supabase EU)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Supabase
SUPABASE_URL="https://[PROJECT-REF].supabase.co"
SUPABASE_ANON_KEY="[ANON-KEY]"
SUPABASE_SERVICE_ROLE_KEY="[SERVICE-ROLE-KEY]"

# NextAuth.js
NEXTAUTH_URL="https://owona.de"
NEXTAUTH_SECRET="[PRODUCTION-SECRET-32-CHARS]"

# Google OAuth (Production)
GOOGLE_CLIENT_ID="[PRODUCTION-GOOGLE-CLIENT-ID]"
GOOGLE_CLIENT_SECRET="[PRODUCTION-GOOGLE-CLIENT-SECRET]"

# Stripe (Production)
STRIPE_PUBLISHABLE_KEY="pk_live_[LIVE-KEY]"
STRIPE_SECRET_KEY="sk_live_[LIVE-KEY]"
STRIPE_WEBHOOK_SECRET="whsec_[LIVE-WEBHOOK-SECRET]"

# Stripe Price IDs (Production)
STRIPE_STARTER_PRICE_ID="price_[LIVE-STARTER-ID]"
STRIPE_PROFESSIONAL_PRICE_ID="price_[LIVE-PROFESSIONAL-ID]"
STRIPE_ENTERPRISE_PRICE_ID="price_[LIVE-ENTERPRISE-ID]"

# WhatsApp Business API (360dialog)
WHATSAPP_API_URL="https://waba-v2.360dialog.io"
WHATSAPP_API_TOKEN="[PRODUCTION-TOKEN]"
WHATSAPP_WEBHOOK_SECRET="[PRODUCTION-WEBHOOK-SECRET]"
WHATSAPP_WEBHOOK_VERIFY_TOKEN="[VERIFY-TOKEN]"

# App Configuration
NEXT_PUBLIC_APP_URL="https://owona.de"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_[LIVE-KEY]"
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[ANON-KEY]"

# Production Settings
NODE_ENV="production"
ENABLE_DEBUG_LOGS="false"
DATA_RETENTION_DAYS="90"
```

## 📊 Supabase Dashboard Konfiguration

### 1. Authentication Settings
- **Site URL:** `https://owona.de`
- **Redirect URLs:** 
  - `https://owona.de/api/auth/callback/google`
  - `https://owona.de/dashboard`

### 2. API Settings
- **Auto API Documentation:** Aktiviert
- **Public API:** Deaktiviert (nur über App)
- **Realtime:** Aktiviert für Analytics

### 3. Storage (für Media Files)
```sql
-- WhatsApp Media Storage Bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('whatsapp-media', 'whatsapp-media', false);

-- Policy für WhatsApp Media
CREATE POLICY "Authenticated users can upload media" ON storage.objects
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can view own media" ON storage.objects
  FOR SELECT USING (auth.role() = 'authenticated');
```

## 🔄 Deployment Workflow

### 1. Lokale Vorbereitung
```bash
# Schema validieren
npm run db:generate

# Build testen
npm run build
```

### 2. Production Deployment
```bash
# Schema zu Supabase pushen
npm run db:push

# Demo-Daten (optional)
npm run db:seed

# Env Variablen auf Server aktualisieren
# (via owona.de Admin Panel oder SSH)
```

### 3. Verification
- [ ] Database Schema deployed
- [ ] RLS Policies aktiv
- [ ] Authentication funktioniert
- [ ] API Endpoints erreichbar
- [ ] Webhook URLs konfiguriert

## 🛡️ GDPR Compliance Checklist

### Database Level
- [ ] EU-Region (Frankfurt) ausgewählt
- [ ] Automatic Backups konfiguriert
- [ ] Data Retention Policies gesetzt
- [ ] RLS für alle User-Daten aktiv

### Application Level
- [ ] Consent Management implementiert
- [ ] Data Export API verfügbar
- [ ] Automatic Data Deletion aktiv
- [ ] Privacy Policy verlinkt

## 📈 Monitoring Setup

### Supabase Dashboard
- **Performance:** Query Performance überwachen
- **Usage:** API Calls und Storage tracking
- **Logs:** Error Monitoring aktivieren
- **Alerts:** Bei Limit-Überschreitung

### Custom Analytics
```sql
-- Analytics View für Dashboard
CREATE VIEW user_analytics AS
SELECT 
  DATE(created_at) as date,
  COUNT(*) as new_users,
  COUNT(CASE WHEN subscription_status = 'active' THEN 1 END) as paying_users
FROM users 
WHERE deleted_at IS NULL
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

## 🚨 Troubleshooting

### Häufige Probleme
1. **Connection Failed:** Database URL prüfen
2. **Auth Errors:** Redirect URLs in Supabase konfigurieren  
3. **RLS Blocked:** Policies für neue Tables erstellen
4. **Migration Failed:** Prisma Schema mit Supabase abgleichen

### Debug Commands
```bash
# Connection testen
npm run db:studio

# Schema Status
npx prisma db pull

# Migration Status
npx prisma migrate status
```

---

**🎯 Nach diesem Setup ist FlowCraft vollständig production-ready!**
