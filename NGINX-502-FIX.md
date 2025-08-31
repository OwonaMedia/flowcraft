# 🔧 NGINX 502 BAD GATEWAY LÖSEN

## ✅ **ERFOLG:** Nginx läuft! (`Server: nginx/1.22.1`)
## ❌ **PROBLEM:** 502 Bad Gateway (FlowCraft nicht erreichbar)

## 🔍 **DIAGNOSE:**

### **1️⃣ FLOWCRAFT STATUS PRÜFEN:**
```bash
# PM2 Status
pm2 list

# FlowCraft Logs
pm2 logs flowcraft --lines 5

# Port 3001 Status
ss -tulpn | grep :3001

# FlowCraft direkt testen
curl -I http://localhost:3001
```

### **2️⃣ N8N TESTEN:**
```bash
# n8n direkt
curl -I http://localhost:5678

# n8n über nginx
curl -I http://automat.owona.de/
```

## ⚡ **WAHRSCHEINLICHE LÖSUNGEN:**

### **A) FLOWCRAFT RESTART:**
```bash
# FlowCraft neu starten
pm2 restart flowcraft

# Status prüfen
pm2 list
ss -tulpn | grep :3001

# Test
curl -I http://localhost:3001
curl -I http://automat.owona.de/flowcraft/
```

### **B) FLOWCRAFT LÄUFT AUF ANDEREM PORT:**
```bash
# Alle Node.js Prozesse anzeigen
ss -tulpn | grep node

# PM2 Status mit Ports
pm2 prettylist

# Falls FlowCraft auf anderem Port läuft, Nginx Config anpassen
nano /etc/nginx/sites-available/flowcraft
# proxy_pass http://localhost:RICHTIGER_PORT/;
```

### **C) AFRIKA-SERVER KONFLIKT:**
```bash
# Afrika Server Status (blockiert möglicherweise)
docker ps | grep afrika

# Falls Afrika Server wieder auf Port 3000:
docker stop 8bf8e5e7ba18

# FlowCraft restart
pm2 restart flowcraft
```

## 🚀 **QUICK FIX SEQUENCE:**
```bash
pm2 list
ss -tulpn | grep :3001
curl -I http://localhost:3001
pm2 restart flowcraft
curl -I http://automat.owona.de/flowcraft/
```

## 🎯 **ERWARTUNG:**
Nach Fix: **HTTP/1.1 200 OK** statt 502

**STARTEN SIE MIT: `pm2 list`** 🔍

