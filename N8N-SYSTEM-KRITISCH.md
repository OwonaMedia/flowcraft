# 🚨 N8N SYSTEM - KRITISCHE INFORMATIONEN

## ⚠️ **WARNUNG: N8N DARF NIEMALS BEEINTRÄCHTIGT WERDEN!**

### 🐳 **N8N DOCKER KONFIGURATION:**

#### **Container Setup:**
- **Container ID:** `df6883d12246`
- **Container Name:** `n8n-docker-caddy_n8n_1`
- **Image:** `docker.n8n.io/n8nio/n8n`
- **Port Mapping:** `5678:5678`
- **Status:** Up 2+ days

#### **Caddy Reverse Proxy (KRITISCH!):**
- **Container ID:** `6cc31823d5c3`
- **Container Name:** `n8n-docker-caddy_caddy_1`
- **Image:** `caddy:latest`
- **Port Mapping:** `80:80, 443:443`
- **Funktion:** SSL/HTTPS Termination für n8n

### 🌐 **URL STRUKTUR:**
- **Öffentlich:** `https://automat.owona.de/` (über Caddy)
- **Intern:** `http://localhost:5678` (direkter n8n Zugang)

### ⚡ **ABHÄNGIGKEITEN:**

#### **n8n braucht Caddy:**
- Caddy Container MUSS laufen: `6cc31823d5c3`
- Caddy managed SSL/HTTPS automatisch
- Caddy läuft auf Port 80/443
- **NIEMALS Caddy stoppen ohne n8n zu überprüfen!**

#### **Port Konflikte:**
- **Port 80:** Caddy (n8n Proxy) - RESERVIERT
- **Port 443:** Caddy (SSL) - RESERVIERT  
- **Port 5678:** n8n direkt - RESERVIERT

### 🔧 **WARTUNG BEFEHLE:**

#### **Status prüfen:**
```bash
# Container Status
docker ps | grep -E "(caddy|n8n)"

# n8n erreichbar?
curl -I http://localhost:5678
curl -I http://automat.owona.de/

# Ports prüfen
ss -tulpn | grep -E ":(80|443|5678)"
```

#### **Restart (falls nötig):**
```bash
# n8n restart
docker restart df6883d12246

# Caddy restart
docker restart 6cc31823d5c3

# Beide zusammen
docker restart 6cc31823d5c3 df6883d12246
```

### 🚨 **KRITISCHE REGELN:**

1. **NIEMALS Caddy Container stoppen** ohne Alternative
2. **Port 80 ist für Caddy reserviert** - kein Nginx auf Port 80
3. **n8n läuft 24/7** - wichtige Workflows aktiv
4. **Bei FlowCraft:** Alternative Ports verwenden (8080, 3001, etc.)
5. **Bei Nginx:** Nur auf anderen Ports (8080, 8090, etc.)

### 📋 **WEITERE SYSTEME:**
- **Afrika Bot:** Container `8bf8e5e7ba18` auf Port 3000
- **n8n Supervisors:** Mehrere Python Prozesse
- **FlowCraft:** PM2 auf Port 3001

### 🎯 **FLOWCRAFT INTEGRATION:**
- **Lösung:** Nginx auf Port 8080
- **URL:** `http://automat.owona.de:8080/flowcraft/`
- **Kein Konflikt:** n8n bleibt auf Port 80

---
**📍 DIESE DATEI IMMER LESEN BEVOR SYSTEM-ÄNDERUNGEN!**

