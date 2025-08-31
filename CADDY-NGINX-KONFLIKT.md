# 🚨 CADDY-NGINX KONFLIKT LÖSEN

## ❌ **PROBLEM:** Caddy läuft auf Port 80, blockiert Nginx

## 🔍 **DIAGNOSE:**
```bash
# Nginx Status prüfen
systemctl status nginx.service

# Nginx Logs anzeigen
journalctl -xeu nginx.service

# Port 80 Status
ss -tulpn | grep :80

# Alle Services auf Port 80
lsof -i :80
```

## ⚡ **SOFORTIGE LÖSUNG:**

### **OPTION A: CADDY STOPPEN (EMPFOHLEN)**
```bash
# Caddy stoppen
systemctl stop caddy
systemctl disable caddy

# Nginx starten
systemctl start nginx
systemctl enable nginx

# Test
curl -I http://automat.owona.de/flowcraft/
curl -I http://automat.owona.de/
```

### **OPTION B: CADDY KONFIGURIEREN**
```bash
# Caddy Config anzeigen
find /etc -name "*caddy*" -type f 2>/dev/null

# Caddy temporär stoppen für Nginx
systemctl stop caddy
systemctl start nginx

# Test
curl -I http://automat.owona.de/flowcraft/
```

### **OPTION C: CADDY VERWENDEN (Alternative)**
```bash
# Caddy Caddyfile konfigurieren
cat > /etc/caddy/Caddyfile << 'EOF'
automat.owona.de {
    # n8n auf Root
    handle {
        reverse_proxy localhost:5678
    }
    
    # FlowCraft auf /flowcraft/
    handle /flowcraft/* {
        reverse_proxy localhost:3001
    }
}

owona.de, www.owona.de {
    reverse_proxy localhost:3001
}
EOF

# Caddy neu laden
systemctl reload caddy

# Test
curl -I http://automat.owona.de/flowcraft/
```

## 🎯 **EMPFEHLUNG:**
**OPTION A** - Caddy stoppen, Nginx verwenden (einfacher)

**STARTEN SIE MIT:**
```bash
systemctl stop caddy
systemctl start nginx
curl -I http://automat.owona.de/flowcraft/
```

