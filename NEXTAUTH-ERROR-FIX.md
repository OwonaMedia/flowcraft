# 🚨 NEXTAUTH CLIENT_FETCH_ERROR BEHEBEN

## ❌ **PROBLEM IDENTIFIZIERT:**
```
[next-auth][error][CLIENT_FETCH_ERROR]
"The string did not match the expected pattern."
```

## 🔍 **URSACHE:**
**NextAuth.js kann nicht mit dem Backend kommunizieren** - wahrscheinlich:
1. **NEXTAUTH_URL** falsch konfiguriert
2. **Supabase Connection** Problem
3. **Environment Variables** fehlen/falsch

## ⚡ **SOFORTIGE LÖSUNG:**

### **1️⃣ ENVIRONMENT VARIABLES PRÜFEN:**
```bash
# Aktuelle .env.local anzeigen
cat /var/www/flowcraft/.env.local

# NextAuth URL korrigieren
cd /var/www/flowcraft
cat > .env.local << 'EOF'
DATABASE_URL="postgresql://postgres:Afidi2008!@db.ddavuntesnxtyikvmkje.supabase.co:5432/postgres"
NEXTAUTH_SECRET="botchat-pro-super-secret-key-2024"
NEXTAUTH_URL="http://91.99.232.126:3001"
NEXT_PUBLIC_SUPABASE_URL="https://ddavuntesnxtyikvmkje.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkYXZ1bnRlc254dHlpa3Zta2plIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NzgyODgsImV4cCI6MjA3MjE1NDI4OH0.BIY4-aQZOsodKF2Nbpg0byKLDolemR96SjoVEe3GMcs"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkYXZ1bnRlc254dHlpa3Zta2plIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjU3ODI4OCwiZXhwIjoyMDcyMTU0Mjg4fQ.HfBZzrvOSAbk5Nve6MZSjYkLnQ2h8un3NPiok0z8YXA"
GDPR_MODE="true"
NODE_ENV="development"
EOF

# PM2 mit neuen Environment Variables restart
pm2 restart flowcraft --update-env
pm2 save
```

### **2️⃣ NEXTAUTH CONFIG REPARIEREN:**
```bash
cd /var/www/flowcraft

# NextAuth config prüfen
find . -name "*auth*" -type f

# Minimal NextAuth config erstellen
cat > lib/auth.ts << 'EOF'
import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    })
  ],
  pages: {
    signIn: '/signin',
    error: '/error',
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      return token
    },
    async session({ session, token }) {
      return session
    },
  },
}
EOF
```

### **3️⃣ SUPABASE CONNECTION TESTEN:**
```bash
cd /var/www/flowcraft

# Supabase direkt testen
curl -I https://ddavuntesnxtyikvmkje.supabase.co

# Environment laden und testen
node -e "
require('dotenv').config({ path: '.env.local' });
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'OK' : 'MISSING');
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'OK' : 'MISSING');
"
```

## 🚀 **QUICK FIX:**
```bash
cd /var/www/flowcraft

# Environment korrigieren
cat > .env.local << 'EOF'
NEXTAUTH_URL="http://91.99.232.126:3001"
NEXTAUTH_SECRET="botchat-pro-super-secret-key-2024"
DATABASE_URL="postgresql://postgres:Afidi2008!@db.ddavuntesnxtyikvmkje.supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://ddavuntesnxtyikvmkje.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkYXZ1bnRlc254dHlpa3Zta2plIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NzgyODgsImV4cCI6MjA3MjE1NDI4OH0.BIY4-aQZOsodKF2Nbpg0byKLDolemR96SjoVEe3GMcs"
EOF

# PM2 restart mit Environment Update
pm2 restart flowcraft --update-env

# Test
curl -I http://91.99.232.126:3001
```

## 🎯 **ERWARTUNG:**
**NextAuth Error verschwindet, FlowCraft lädt normal**

