# 🚀 FlowCraft - Demo Setup Guide

**FlowCraft** ist eine WhatsApp Bot SaaS-Plattform für deutsche Unternehmen - 100% DSGVO-konform und EU-gehostet.

## 🎯 Demo Features

- ✅ **Visual Bot Builder** - Drag & Drop Interface mit React Flow
- ✅ **WhatsApp Integration** - 360dialog Business API
- ✅ **3-Tier Subscription** - Stripe Integration mit EU-Compliance
- ✅ **GDPR-konform** - Automatische Datenlöschung und Consent Management
- ✅ **Bot Templates** - Kundenservice, Lead Gen, Terminbuchung
- ✅ **Real-time Analytics** - Nachrichtenverfolgung und Performance Metrics

## 🏃‍♂️ Quick Start (Demo Mode)

### 1. Server starten
```bash
npm run dev
```
Server läuft auf: `http://localhost:3000`

### 2. Demo-Daten laden
```bash
npm run db:seed
```

### 3. Demo Login
- **URL:** `http://localhost:3000/demo`
- **Demo-User:** `demo@flowcraft.de`
- Automatischer Zugang ohne Auth (Demo-Modus)

## 🛠️ Production Setup

### Environment Variables
Erstellen Sie `.env.local` mit folgenden Werten:

```env
# Database (Supabase EU)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-32-chars-min"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Stripe
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# WhatsApp (360dialog)
WHATSAPP_API_URL="https://waba-v2.360dialog.io"
WHATSAPP_API_TOKEN="your-token"
```

### Database Setup
```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# Seed demo data
npm run db:seed
```

## 📊 Demo Scenarios

### 1. Bot Builder Demo
1. Gehe zu `/dashboard/bots/new`
2. Wähle "Kundenservice Bot" Template
3. Bearbeite Flow im Visual Editor
4. Teste Bot mit integriertem Chat

### 2. WhatsApp Integration Demo
1. Bot erstellen oder auswählen
2. WhatsApp Verbindung konfigurieren
3. Webhook-URL: `/api/webhooks/whatsapp`
4. Teste mit echter WhatsApp-Nummer

### 3. Subscription Demo
1. Gehe zu `/dashboard/settings`
2. Upgrade auf Professional Plan
3. Stripe Checkout Prozess
4. Billing Portal testen

## 🎨 Templates

### Kundenservice Bot
- **Verwendung:** FAQ, Support-Tickets, Weiterleitung
- **Features:** Bestellverfolgung, Rückgaben, Live-Chat
- **Flow:** Start → Menü → Kategorien → Lösung/Weiterleitung

### Lead Generation Bot
- **Verwendung:** Interessenten qualifizieren, Kontakte sammeln
- **Features:** Interesse bewerten, E-Mail sammeln, CRM Integration
- **Flow:** Intro → Interesse → Qualifikation → Kontakt → Follow-up

### Terminbuchung Bot
- **Verwendung:** Automatische Termine, Kalender-Sync
- **Features:** Verfügbarkeit prüfen, Bestätigung, Erinnerungen
- **Flow:** Service wählen → Zeit wählen → Kontakt → Bestätigung

## 📈 Analytics Dashboard

- **Nachrichten:** Ein-/Ausgehend, Response-Zeit
- **Kontakte:** Unique Users, Engagement-Rate
- **Conversions:** Flow-Completion, Lead-Quality
- **Performance:** Bot-Uptime, Error-Rate

## 🔧 Development Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run db:push         # Push schema changes
npm run db:studio       # Open Prisma Studio
npm run db:seed         # Seed demo data
npm run db:generate     # Generate Prisma client

# Testing
npm run test:whatsapp   # Test WhatsApp API connection
```

## 🚨 Demo Limitations

- **Demo-Modus:** Keine echte WhatsApp-Verbindung ohne API-Keys
- **Stripe:** Test-Modus mit Test-Karten
- **E-Mail:** Keine echten E-Mails ohne SMTP-Setup
- **Data Retention:** Demo-Daten werden regelmäßig zurückgesetzt

## 🎯 Next Steps für Production

1. **Supabase Setup** - EU PostgreSQL Database
2. **360dialog Account** - WhatsApp Business API
3. **Google OAuth** - Client ID/Secret erstellen
4. **Stripe Account** - Payment Processing einrichten
5. **Domain & SSL** - Production Deployment
6. **GDPR Compliance** - Legal Pages, Consent Forms

---

**🚀 FlowCraft - Intelligente WhatsApp-Workflows für deutsche Unternehmen**

*DSGVO-konform • EU-gehostet • Enterprise-ready*
