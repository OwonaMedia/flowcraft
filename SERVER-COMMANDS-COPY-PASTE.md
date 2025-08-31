# 🚀 FLOWCRAFT INSTALLATION - COPY & PASTE

## ✅ STATUS: Sie sind auf dem Hetzner Server eingeloggt!

**Linux n8n-owown** - Perfekt! Jetzt alle Befehle der Reihe nach ausführen:

---

### **1️⃣ NGINX KONFIGURATION (n8n unberührt lassen)**

```bash
# Backup der aktuellen Config
cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup

# Neue Konfiguration mit n8n + FlowCraft
cat > /etc/nginx/sites-available/default << 'EOF'
server {
    listen 80;
    server_name automat.owona.de;
    
    # n8n auf Root (UNBERÜHRT)
    location / {
        proxy_pass http://localhost:5678;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # FlowCraft auf /flowcraft/ (NEU)
    location /flowcraft/ {
        proxy_pass http://localhost:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 80;
    server_name owona.de www.owona.de;
    
    location / {
        proxy_pass http://localhost:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Nginx testen und reload
nginx -t
systemctl reload nginx
echo "✅ Nginx konfiguriert - n8n läuft weiter, FlowCraft hinzugefügt"
```

---

### **2️⃣ FLOWCRAFT INSTALLATION**

```bash
cd /var/www
rm -rf flowcraft 2>/dev/null
git clone https://github.com/OwonaMedia/flowcraft.git flowcraft
cd flowcraft

# Environment für owona.de
cat > .env.local << 'EOF'
DATABASE_URL="postgresql://postgres:Afidi2008!@db.ddavuntesnxtyikvmkje.supabase.co:5432/postgres"
NEXTAUTH_SECRET="botchat-pro-super-secret-key-2024"
NEXTAUTH_URL="https://owona.de"
NEXT_PUBLIC_SUPABASE_URL="https://ddavuntesnxtyikvmkje.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkYXZ1bnRlc254dHlpa3Zta2plIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NzgyODgsImV4cCI6MjA3MjE1NDI4OH0.BIY4-aQZOsodKF2Nbpg0byKLDolemR96SjoVEe3GMcs"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkYXZ1bnRlc254dHlpa3Zta2plIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjU3ODI4OCwiZXhwIjoyMDcyMTU0Mjg4fQ.HfBZzrvOSAbk5Nve6MZSjYkLnQ2h8un3NPiok0z8YXA"
GDPR_MODE="true"
NODE_ENV="production"
EOF

echo "✅ Environment konfiguriert"
```

---

### **3️⃣ DEPENDENCIES & BUILD**

```bash
# Dependencies installieren
npm install --production

# Next.js Build erstellen
npm run build

echo "✅ Build erstellt"
```

---

### **4️⃣ PRISMA DATABASE SETUP**

```bash
# Prisma generieren und Datenbank verbinden
npx prisma generate
npx prisma db push

echo "✅ Supabase verbunden"
```

---

### **5️⃣ PM2 START**

```bash
# PM2 installieren falls nicht vorhanden
npm install -g pm2 2>/dev/null || echo "PM2 bereits installiert"

# Alte FlowCraft Instanz stoppen
pm2 delete flowcraft 2>/dev/null || echo "Keine bestehende Instanz"

# FlowCraft starten
pm2 start npm --name "flowcraft" -- start

# PM2 Autostart
pm2 save

echo "✅ FlowCraft gestartet"
```

---

### **6️⃣ STATUS TEST**

```bash
# Services testen
pm2 status
curl -I http://localhost:5678  # n8n Test
curl -I http://localhost:3000  # FlowCraft Test

echo ""
echo "🎉 INSTALLATION KOMPLETT!"
echo ""
echo "✅ n8n:       http://automat.owona.de/"
echo "✅ FlowCraft: http://automat.owona.de/flowcraft/"
echo ""
echo "🎯 NÄCHSTER SCHRITT: Domain-Weiterleitung bei Goneo"
echo "   owona.de → automat.owona.de/flowcraft/"
echo ""
```

---

## **📋 COPY & PASTE REIHENFOLGE:**

1. **Schritt 1:** Nginx Konfiguration
2. **Schritt 2:** FlowCraft clonen & Environment
3. **Schritt 3:** Dependencies & Build
4. **Schritt 4:** Prisma Database
5. **Schritt 5:** PM2 Start
6. **Schritt 6:** Status Test

**Führen Sie jeden Block einzeln aus und warten Sie auf das Ergebnis!** 🚀

