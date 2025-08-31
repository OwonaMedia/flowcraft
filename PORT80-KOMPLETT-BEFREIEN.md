# 🚨 PORT 80 KOMPLETT BEFREIEN - N8N RETTEN

## ❌ **PROBLEM:** Port 80 immer noch belegt (`bind: address already in use`)

## 🔍 **WAS BLOCKIERT PORT 80:**

### **1️⃣ ALLE PROZESSE AUF PORT 80 FINDEN:**
```bash
# Wer benutzt Port 80?
ss -tulpn | grep :80

# Detailliert mit PID
lsof -i :80

# Alle nginx Prozesse
ps aux | grep nginx
```

### **2️⃣ NGINX KOMPLETT KILLEN:**
```bash
# Nginx Service stoppen
systemctl stop nginx
systemctl disable nginx

# Nginx Prozesse killen
pkill -f nginx

# Nochmal prüfen
ss -tulpn | grep :80
ps aux | grep nginx
```

### **3️⃣ CADDY STARTEN:**
```bash
# Port 80 sollte jetzt frei sein
ss -tulpn | grep :80

# Caddy starten
docker start 6cc31823d5c3

# Status prüfen
docker ps | grep caddy

# n8n testen
curl -I http://automat.owona.de/
```

## ⚡ **NOTFALL-LÖSUNG:**

### **ALLE SERVICES NEUSTARTEN:**
```bash
# System komplett aufräumen
systemctl stop nginx
pkill -f nginx
docker restart 6cc31823d5c3

# Status prüfen
docker ps
ss -tulpn | grep :80

# n8n testen
curl -I http://automat.owona.de/
curl -I http://localhost:5678
```

## 🎯 **SOFORT AUSFÜHREN:**
```bash
ss -tulpn | grep :80
pkill -f nginx
docker start 6cc31823d5c3
curl -I http://automat.owona.de/
```

**Das sollte n8n wieder zum Leben erwecken!** 🚀

