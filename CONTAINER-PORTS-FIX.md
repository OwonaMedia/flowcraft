# 🎯 CONTAINER PORTS KONFLIKT LÖSEN

## 📋 **GEFUNDENE CONTAINER:**
- **Caddy:** `6cc31823d5c3` → Port 80 (blockiert Nginx)
- **n8n:** `df6883d12246` → Port 5678 (OK)
- **Afrika Server:** `8bf8e5e7ba18` → Port 3000 (blockiert FlowCraft!)

## ⚡ **LÖSUNG - PORTS FREIGEBEN:**

### **OPTION A: CADDY STOPPEN (n8n läuft direkt)**
```bash
# Caddy Container stoppen
docker stop 6cc31823d5c3

# Port 80 prüfen
ss -tulpn | grep :80

# Nginx starten
systemctl start nginx

# Test
curl -I http://automat.owona.de/     # n8n über nginx
curl -I http://automat.owona.de/flowcraft/  # FlowCraft über nginx
```

### **OPTION B: FLOWCRAFT AUF ANDEREN PORT**
```bash
# FlowCraft auf Port 3002 starten
cd /var/www/flowcraft
pm2 delete flowcraft
PORT=3002 pm2 start npm --name "flowcraft" -- run dev
pm2 save

# Nginx Config für Port 3002 anpassen
sed -i 's/localhost:3001/localhost:3002/g' /etc/nginx/sites-available/flowcraft

# Caddy stoppen, Nginx starten
docker stop 6cc31823d5c3
systemctl start nginx

# Test
curl -I http://automat.owona.de/flowcraft/
```

### **OPTION C: AFRIKA SERVER STOPPEN (falls nicht gebraucht)**
```bash
# Afrika Server temporär stoppen
docker stop 8bf8e5e7ba18

# FlowCraft bleibt auf Port 3001
pm2 restart flowcraft

# Caddy stoppen, Nginx starten
docker stop 6cc31823d5c3
systemctl start nginx

# Test
curl -I http://automat.owona.de/flowcraft/
```

## 🚀 **EMPFEHLUNG - OPTION A:**
```bash
# Caddy stoppen (n8n läuft trotzdem auf 5678)
docker stop 6cc31823d5c3

# Nginx starten
systemctl start nginx

# Live Test
curl -I http://automat.owona.de/
curl -I http://automat.owona.de/flowcraft/
```

## 🎯 **NACH ERFOLG:**
- `http://automat.owona.de/` → n8n (Port 5678)
- `http://automat.owona.de/flowcraft/` → FlowCraft (Port 3001 oder 3002)

**STARTEN SIE MIT OPTION A!** 🚀

