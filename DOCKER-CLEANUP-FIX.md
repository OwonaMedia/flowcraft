# 🔧 DOCKER CLEANUP - ALLE N8N CONTAINER STOPPEN

## 🚨 **PROBLEM:** Mehrere n8n Container laufen gleichzeitig

## 🔍 **ALLE N8N CONTAINER FINDEN UND STOPPEN:**

### **1️⃣ ALLE DOCKER CONTAINER ANZEIGEN:**
```bash
# Alle laufenden Container
docker ps

# Spezifisch nach n8n suchen
docker ps | grep -i n8n

# Alle Container mit Port 5678
docker ps --filter "publish=5678"

# Alle Container mit Port 80
docker ps --filter "publish=80"
```

### **2️⃣ ALLE N8N CONTAINER STOPPEN:**
```bash
# Alle Container stoppen die n8n im Namen haben
docker ps -a | grep n8n | awk '{print $1}' | xargs docker stop

# ODER: Alle Container mit Port 5678 stoppen
docker ps --filter "publish=5678" -q | xargs docker stop

# ODER: Manuell nach Container ID
docker stop CONTAINER_ID_HIER
```

### **3️⃣ AUFRÄUMEN:**
```bash
# Gestoppte Container entfernen
docker container prune -f

# Neuen n8n Container entfernen (der nicht starten konnte)
docker rm n8n-new

# Nochmal alle Container anzeigen
docker ps
```

### **4️⃣ N8N NEU STARTEN (ohne Port 80):**
```bash
# Port-Status prüfen
ss -tulpn | grep -E ":(80|5678)"

# N8N nur auf Port 5678 (kein Port 80 Mapping!)
docker run -d \
  --name n8n-clean \
  -p 5678:5678 \
  -v n8n_data:/home/node/.n8n \
  --restart unless-stopped \
  n8nio/n8n

# Prüfen ob Port 80 frei ist
ss -tulpn | grep :80
```

### **5️⃣ NGINX STARTEN:**
```bash
systemctl start nginx
systemctl status nginx
curl -I http://automat.owona.de/flowcraft/
```

## 🎯 **SCHRITT FÜR SCHRITT:**
1. `docker ps` → Container finden
2. `docker stop CONTAINER_ID` → Stoppen  
3. `ss -tulpn | grep :80` → Port 80 prüfen
4. `systemctl start nginx` → Nginx starten

**STARTEN SIE MIT: `docker ps`** 🔍

