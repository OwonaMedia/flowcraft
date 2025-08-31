# 🚀 FlowCraft - Supabase Production Setup für owona.de

## 📋 **Schritt 1: Supabase Projekt erstellen**

### 1.1 Supabase Dashboard
- **URL:** https://supabase.com/dashboard
- **Aktion:** "New Project" klicken

### 1.2 Projekt-Konfiguration
```
Project Name: flowcraft-production
Organization: [Ihr Account]
Database Password: [Sicheres Passwort generieren - NOTIEREN!]
Region: Europe (Frankfurt) - WICHTIG für GDPR!
```

### 1.3 Nach Erstellung - API Keys kopieren
**Gehen Sie zu: Settings > API**

## 📝 **Schritt 2: .env.local erstellen**

Erstellen Sie `.env.local` im Projektordner mit:

```env
# ===== SUPABASE (aus Settings > API) =====
DATABASE_URL="postgresql://postgres:[IHR-PASSWORT]@db.[PROJECT-REF].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[IHR-PASSWORT]@db.[PROJECT-REF].supabase.co:5432/postgres"
SUPABASE_URL="https://[PROJECT-REF].supabase.co"
SUPABASE_ANON_KEY="[ANON-KEY-HIER-EINFÜGEN]"
SUPABASE_SERVICE_ROLE_KEY="[SERVICE-ROLE-KEY-HIER-EINFÜGEN]"

# ===== FÜR PRODUCTION =====
NEXTAUTH_URL="https://owona.de"
NEXTAUTH_SECRET="[32-ZEICHEN-SECRET-GENERIEREN]"
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://owona.de"
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[ANON-KEY-HIER-EINFÜGEN]"

# ===== SPÄTER KONFIGURIEREN =====
# Google OAuth, Stripe, WhatsApp - können später hinzugefügt werden
```

## 🔧 **Schritt 3: Schema deployen**

Nach .env.local Erstellung:

```bash
# 1. Prisma Client generieren
npm run db:generate

# 2. Schema zu Supabase pushen
npm run db:push

# 3. Setup-Script ausführen
npm run setup:supabase

# 4. Demo-Daten erstellen (optional)
npm run db:seed
```

## 🛡️ **Schritt 4: Supabase Dashboard Konfiguration**

### 4.1 Authentication Settings
**Gehen Sie zu: Authentication > Settings**

```
Site URL: https://owona.de
Additional Redirect URLs:
- https://owona.de/api/auth/callback/google
- https://owona.de/dashboard
```

### 4.2 Database Settings
**Gehen Sie zu: Database > Tables**

Überprüfen Sie, dass folgende Tabellen erstellt wurden:
- ✅ users
- ✅ bots  
- ✅ bot_flows
- ✅ messages
- ✅ bot_analytics
- ✅ bot_templates

## 🧪 **Schritt 5: Testen**

```bash
# 1. Database Connection testen
npm run db:studio

# 2. Schema Status prüfen
npx prisma db pull

# 3. FlowCraft starten
npm run dev
```

**Testen Sie:**
- ✅ http://localhost:3000/demo - Demo-Modus
- ✅ Dashboard funktioniert
- ✅ Bot Builder lädt
- ✅ Keine Database-Fehler

## 🚨 **Troubleshooting**

### Problem: "Database connection failed"
```bash
# .env.local prüfen
cat .env.local | grep DATABASE_URL

# Connection testen
npx prisma db pull
```

### Problem: "Schema sync issues"
```bash
# Schema neu pushen
npm run db:push --accept-data-loss

# Prisma neu generieren
npm run db:generate
```

### Problem: "RLS blocking queries"
**Lösung:** Gehen Sie zu Supabase Dashboard > SQL Editor:

```sql
-- RLS für Demo temporär deaktivieren
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE bots DISABLE ROW LEVEL SECURITY;
```

## ✅ **Erfolgs-Checkliste**

- [ ] Supabase Projekt erstellt (EU-Region)
- [ ] .env.local mit korrekten Keys
- [ ] `npm run db:push` erfolgreich
- [ ] `npm run setup:supabase` ohne Fehler
- [ ] Demo-Seite lädt (localhost:3000/demo)
- [ ] Dashboard erreichbar
- [ ] Bot Builder funktioniert
- [ ] Keine Console-Errors

## 🎯 **Nach erfolgreichem Setup**

FlowCraft ist dann bereit für:
1. **Google OAuth Konfiguration**
2. **Stripe Integration Setup** 
3. **WhatsApp API Verbindung**
4. **Production Deployment auf owona.de**

---

**📞 Bei Problemen:** Führen Sie `npm run setup:supabase` aus - es zeigt detaillierte Fehlermeldungen!
