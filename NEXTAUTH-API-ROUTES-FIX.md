# 🔧 NEXTAUTH API ROUTES ERSTELLEN

## ✅ **FORTSCHRITT:** FlowCraft lädt (GET / 200), aber NextAuth APIs fehlen

## ❌ **FEHLENDE API ROUTES:**
```
GET /api/auth/session/ 404
POST /api/auth/_log/ 404
```

## ⚡ **SOFORTIGE LÖSUNG:**

### **1️⃣ NEXTAUTH API ROUTE ERSTELLEN:**
```bash
cd /var/www/flowcraft

# API Auth Verzeichnis erstellen
mkdir -p app/api/auth/[...nextauth]

# NextAuth API Route erstellen
cat > app/api/auth/[...nextauth]/route.ts << 'EOF'
import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
EOF
```

### **2️⃣ AUTH CONFIG ERSTELLEN:**
```bash
cd /var/www/flowcraft

# Lib Verzeichnis erstellen
mkdir -p lib

# Minimale Auth Config
cat > lib/auth.ts << 'EOF'
import { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
  providers: [],
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

### **3️⃣ CROSS-ORIGIN CONFIG:**
```bash
cd /var/www/flowcraft

# Next.js Config für Cross-Origin
cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    allowedDevOrigins: ['91.99.232.126', 'automat.owona.de']
  }
}

module.exports = nextConfig
EOF
```

### **4️⃣ TYPESCRIPT CONFIG:**
```bash
cd /var/www/flowcraft

# TSConfig für Path Mapping
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOF
```

## 🚀 **QUICK FIX SEQUENCE:**
```bash
cd /var/www/flowcraft

# 1. NextAuth API Route
mkdir -p app/api/auth/[...nextauth]
cat > app/api/auth/[...nextauth]/route.ts << 'EOF'
import NextAuth from "next-auth"

const authOptions = {
  providers: [],
  session: { strategy: "jwt" as const },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
EOF

# 2. Cross-origin fix
cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    allowedDevOrigins: ['91.99.232.126', 'automat.owona.de']
  }
}
module.exports = nextConfig
EOF

# 3. Restart
pm2 restart flowcraft

# 4. Test
curl -I http://localhost:3001/api/auth/session
```

## 🎯 **ERWARTUNG:**
**200 OK** statt 404 für NextAuth APIs

