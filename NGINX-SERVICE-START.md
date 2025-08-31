# 🚀 NGINX SERVICE STARTEN - FINALE LÖSUNG

## ✅ **STATUS:** Nginx Config OK, aber Service nicht aktiv

## 🔧 **SOFORTIGE LÖSUNG:**

### **1️⃣ NGINX SERVICE STARTEN:**
```bash
# Nginx starten
systemctl start nginx

# Nginx aktivieren (auto-start)
systemctl enable nginx

# Status prüfen
systemctl status nginx

# Test
curl -I http://automat.owona.de/flowcraft/
```

### **2️⃣ FALLS KONFLIKT-WARNUNGEN:**
```bash
# Alte/konflikierende Configs entfernen
rm -f /etc/nginx/sites-enabled/default
rm -f /etc/nginx/sites-enabled/mcp-servers*

# Nur unsere FlowCraft Config aktiv lassen
ls -la /etc/nginx/sites-enabled/

# Nginx restart
systemctl restart nginx

# Finale Tests
curl -I http://automat.owona.de/flowcraft/
curl -I http://automat.owona.de/
```

### **3️⃣ DEBUGGING (falls nötig):**
```bash
# Nginx Logs prüfen
journalctl -u nginx -f

# Aktive Configs anzeigen
nginx -T | grep server_name

# Port-Status prüfen
ss -tulpn | grep :80
```

## 🎯 **ERWARTUNG:**
- `http://automat.owona.de/` → n8n
- `http://automat.owona.de/flowcraft/` → FlowCraft (HTTP 200)

## ⚡ **QUICK START:**
```bash
systemctl start nginx
systemctl enable nginx
curl -I http://automat.owona.de/flowcraft/
```

**Das sollte es lösen!** 🚀

