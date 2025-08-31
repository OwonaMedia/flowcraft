# 🐳 DOCKER N8N - PERFEKTE LÖSUNG GEFUNDEN!

## ✅ **ERKENNTNISSE:**
- **n8n:** Docker Container auf Port 5678 ✅
- **Port 80:** Docker-Proxy (n8n Port-Mapping) ✅
- **Caddy:** Existiert NICHT (`Unit caddy.service could not be found`) ✅
- **n8n direkt:** HTTP 200 OK ✅

## 🎯 **LÖSUNG: DOCKER PORT-MAPPING ÄNDERN**

### **1️⃣ N8N DOCKER CONTAINER FINDEN:**
```bash
# Aktueller n8n Container
docker ps | grep n8n

# Container Details
docker inspect $(docker ps -q --filter "ancestor=*n8n*" | head -1)

# Port-Mapping anzeigen
docker port $(docker ps -q --filter "ancestor=*n8n*" | head -1)
```

### **2️⃣ N8N CONTAINER NEU STARTEN (ohne Port 80):**
```bash
# Aktuellen Container stoppen
docker stop $(docker ps -q --filter "ancestor=*n8n*" | head -1)

# Container mit neuem Port-Mapping starten
docker run -d \
  --name n8n-new \
  -p 5678:5678 \
  -v n8n_data:/home/node/.n8n \
  --restart unless-stopped \
  n8nio/n8n

# Test - Port 80 sollte frei sein
ss -tulpn | grep :80
```

### **3️⃣ NGINX STARTEN:**
```bash
# Nginx sollte jetzt starten können
systemctl start nginx
systemctl enable nginx

# Tests
curl -I http://localhost:5678        # n8n direkt
curl -I http://automat.owona.de/     # n8n über nginx
curl -I http://automat.owona.de/flowcraft/  # FlowCraft über nginx
```

### **4️⃣ FINALE KONFIGURATION:**
```bash
# Nginx Status
systemctl status nginx

# Alle Services
ss -tulpn | grep -E ":(80|5678|3001)"

# Live URLs
echo "✅ n8n: http://automat.owona.de/"
echo "✅ FlowCraft: http://automat.owona.de/flowcraft/"
```

## 🚀 **QUICK FIX:**
```bash
docker stop $(docker ps -q --filter "ancestor=*n8n*" | head -1)
docker run -d --name n8n-new -p 5678:5678 -v n8n_data:/home/node/.n8n --restart unless-stopped n8nio/n8n
systemctl start nginx
curl -I http://automat.owona.de/flowcraft/
```

**Das ist die perfekte Lösung!** 🎯

