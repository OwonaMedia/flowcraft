# 🔑 FlowCraft - Komplette .env.local Konfiguration

## ✅ **Diese Werte sind komplett und ready-to-use:**

```env
# ===== SUPABASE BOTCHAT-PRO PROJEKT =====
SUPABASE_URL="https://ddavuntesnxtyikvmkje.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkYXZ1bnRlc254dHlpa3Zta2plIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NzgyODgsImV4cCI6MjA3MjE1NDI4OH0.BIY4-aQZOsodKF2Nbpg0byKLDolemR96SjoVEe3GMcs"

# ===== DATABASE CONNECTION =====
DATABASE_URL="postgresql://postgres:Afidi2008!@db.ddavuntesnxtyikvmkje.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:Afidi2008!@db.ddavuntesnxtyikvmkje.supabase.co:5432/postgres"

# ===== DEVELOPMENT SETTINGS =====
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="flowcraft-development-secret-key-32-chars-minimum"
NODE_ENV="development"

# ===== PUBLIC KEYS =====
NEXT_PUBLIC_SUPABASE_URL="https://ddavuntesnxtyikvmkje.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkYXZ1bnRlc254dHlpa3Zta2plIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NzgyODgsImV4cCI6MjA3MjE1NDI4OH0.BIY4-aQZOsodKF2Nbpg0byKLDolemR96SjoVEe3GMcs"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## ⚠️ **NOCH BENÖTIGT:**

Nur noch 1 Wert fehlt - der **SERVICE_ROLE_KEY** aus dem Supabase Dashboard:

1. **Gehen Sie zu:** https://supabase.com/dashboard/project/ddavuntesnxtyikvmkje/settings/api
2. **Kopieren Sie:** Den `service_role` Key (sehr langer String)
3. **Fügen Sie hinzu:** `SUPABASE_SERVICE_ROLE_KEY="[IHR-SERVICE-ROLE-KEY]"`

## 🚀 **Sofort nach .env.local Update:**

```bash
npm run setup:supabase
```

Wird automatisch:
- ✅ Database Connection testen  
- ✅ Schema deployen (alle FlowCraft Tabellen)
- ✅ RLS konfigurieren
- ✅ Bereit für Demo-Daten
