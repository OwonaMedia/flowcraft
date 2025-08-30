# 🔧 FlowCraft

**Das Handwerk der Automatisierung** - Die intelligente Automation-Plattform für den DACH-Markt.

## 🚀 Mission
Deutschen Unternehmen ermöglichen, meisterhafte Workflows in Minuten zu erschaffen - DSGVO-konform, ohne Programmierkenntnisse und mit der Präzision deutscher Handwerkskunst.

## ✨ Features
- 🎨 **Visual Flow Builder** - Erschaffen Sie Workflows wie ein Meister
- 🛡️ **100% DSGVO-konform** - EU-Server, lokale AI, automatische PII-Filterung
- 🧠 **Deutsche AI-Integration** - Lokale KI-Verarbeitung (keine USA-Datenübertragung)
- 📱 **Multi-Channel Automation** - WhatsApp, Email, SMS in einer Plattform
- 📊 **Real-time Analytics** - Workflow Performance und Customer Insights
- 🏷️ **Handwerk-Templates** - Branchenspezifische Vorlagen von Meistern für Meister

## 🛠️ Tech Stack
- **Frontend:** Next.js 14 + TypeScript + Tailwind CSS
- **Backend:** Next.js API Routes + tRPC + Prisma
- **Database:** PostgreSQL (Supabase EU)
- **Auth:** NextAuth.js
- **Payments:** Stripe
- **WhatsApp:** Business API via 360dialog
- **AI:** Local Phi-3-mini + OpenAI fallback

## 🏗️ Development Setup

### Prerequisites
- Node.js 20+
- Cursor AI
- Git

### Quick Start
```bash
# Clone repository
git clone <your-repo-url>
cd flowcraft

# Install dependencies
npm install

# Setup database
npm run db:setup

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see FlowCraft in action.

## 📁 Project Structure
```
/app                # Next.js App Router
  /api             # API endpoints
  /dashboard       # FlowCraft Studio
  /(auth)          # Authentication pages
/components        # Reusable UI components
/lib              # Utilities and configurations
/hooks            # Custom React hooks
/types            # TypeScript definitions
/public           # Static assets
```

## 🚀 Development Workflow (Solo mit Cursor AI)

### Daily Routine
1. **Morning:** Review progress, plan today's workflow features
2. **Development:** Cursor AI pair programming
3. **Testing:** Manual testing + flow validation
4. **Evening:** Deploy + document

### Cursor AI Prompts
```
Create a visual workflow builder with React Flow
Implement multi-channel automation for WhatsApp, Email, SMS
Build GDPR-compliant automation engine
Design responsive FlowCraft Studio with Tailwind CSS
```

## 📈 MVP Development Status

### ✅ Phase 1: Foundation (ABGESCHLOSSEN)
- [x] Next.js setup with TypeScript + Tailwind
- [x] FlowCraft branding and project structure
- [x] Authentication system (NextAuth.js)
- [x] Database schema (Supabase + Prisma)
- [x] FlowCraft Studio dashboard
- [x] Multi-channel API integration foundation

### ✅ Phase 2: Flow Builder (ABGESCHLOSSEN)
- [x] Visual flow builder (React Flow)
- [x] Node types (Start, Message, Condition, Input, Handoff, End)
- [x] Flow validation + testing interface
- [x] Real-time flow preview
- [x] Bot simulation and testing

### ✅ Phase 3: Core Features (ABGESCHLOSSEN)
- [x] Database integration for workflow persistence
- [x] Workflow management (CRUD operations)
- [x] Analytics dashboard
- [x] User management and settings
- [x] GDPR compliance features

### 🚀 Phase 4: Production Ready (AKTUELL)
- [x] Complete FlowCraft rebranding
- [ ] WhatsApp API testing interface
- [ ] Production deployment setup
- [ ] Performance optimization
- [ ] Security audit

## 💰 Business Model - FlowCraft
- **Starter:** €49/Monat (3 Workflows, 1.000 Nachrichten)
- **Handwerker:** €99/Monat (10 Workflows, 5.000 Nachrichten)
- **Meister:** €299/Monat (Unlimited Workflows, 25.000 Nachrichten)
- **Enterprise:** €999+/Monat (White-Label, Custom Features)

## 🎯 Success Metrics
- **MVP Launch:** 10 Beta Kunden
- **Monat 2:** €2.500 MRR (50 Handwerker)
- **Monat 3:** €5.000 MRR (100 Handwerker)
- **Monat 6:** €10.000 MRR (200 Meister)

## 🛡️ GDPR Compliance
- EU-hosted infrastructure (Supabase EU)
- Local AI processing (Phi-3-mini)
- Automatic PII redaction
- Data minimization principles
- User consent management
- Right to deletion

## 📊 Key Commands
```bash
# Development
npm run dev              # Start FlowCraft Studio
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run db:setup        # Complete database setup
npm run db:push         # Push schema changes
npm run db:studio       # Open Prisma Studio
npm run db:generate     # Generate Prisma client
npm run db:seed         # Seed database

# Testing
npm run test:whatsapp   # Test WhatsApp integration

# Deployment
vercel --prod           # Deploy to Vercel
```

## 🔍 Project Files
- **`.cursorrules`** - Cursor AI development guidelines
- **`DEVELOPMENT-PLAN.md`** - Detailed development roadmap
- **`docs-business-plan.json`** - Complete business analysis
- **`README.md`** - This file

## 🚀 Completed Features

### 🎨 Visual Flow Builder
- Drag & Drop workflow creation
- 6 node types with full customization
- Real-time flow validation
- Interactive flow testing
- Flow preview and simulation

### 📊 FlowCraft Studio Dashboard
- Workflow overview and management
- Real-time analytics and insights
- User settings and preferences
- Subscription management
- Activity monitoring

### 🔧 Workflow Engine
- Complete CRUD operations for workflows
- Database persistence with Prisma
- Flow execution simulation
- Error handling and validation
- Performance monitoring

### 🛡️ Security & Compliance
- GDPR-compliant data handling
- User consent management
- Data export and deletion
- EU-hosted infrastructure
- Local AI processing

## 💡 FlowCraft Success Principles
- **Handwerkskunst:** Präzision und Qualität in jedem Workflow
- **Innovation:** Moderne Technologie mit traditionellen Werten
- **DSGVO-First:** Datenschutz als Grundprinzip
- **Skalierbarkeit:** Von WhatsApp zu Multi-Channel Automation
- **Community:** Von Meistern für Meister

## 🌟 FlowCraft Produktlinien (Zukunft)
- **FlowCraft Chat** - WhatsApp & Messaging Automation
- **FlowCraft Voice** - Telefon & Sprach-Automation  
- **FlowCraft Mail** - Email Marketing Automation
- **FlowCraft CRM** - Customer Relationship Management
- **FlowCraft Analytics** - Business Intelligence Suite

## 📞 Contact
- **Produkt:** FlowCraft - Das Handwerk der Automatisierung
- **Entwicklung:** Solo + Cursor AI
- **Zielmarkt:** DACH Automation & Handwerk
- **Vision:** Die führende Automation-Plattform Europas

---

**🔧 Mit ❤️ und Cursor AI erschaffen für den DACH-Markt**

**Status:** 🚀 MVP Ready - FlowCraft Studio produktiv einsatzbereit!