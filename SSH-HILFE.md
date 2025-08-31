# 🆘 SSH-VERBINDUNG HILFE

## ❗ PROBLEM:
Sie sind immer noch im **LOKALEN Terminal** (Mac), nicht auf dem Server!

## 🔍 WIE SIE DAS ERKENNEN:
**AKTUELL (Mac):** `/Users/salomon/Documents/SaaS/botchat-pro`
**ZIEL (Server):** `root@n8n-owown:~#`

## ✅ SCHRITT-FÜR-SCHRITT ANLEITUNG:

### **1️⃣ Neues Terminal öffnen (oder aktuelles verwenden)**

### **2️⃣ SSH-Befehl eingeben:**
```bash
ssh root@automat.owona.de
```

### **3️⃣ Passwort eingeben wenn gefragt:**
```
LpXqTEPurwUu
```

### **4️⃣ Warten auf erfolgreiche Verbindung:**
Sie sehen dann sowas wie:
```
Linux n8n-owown 6.1.0-37-amd64 #1 SMP PREEMPT_DYNAMIC Debian...
root@n8n-owown:~#
```

### **5️⃣ ERST DANN die Server-Befehle ausführen!**

## 🚨 HÄUFIGE PROBLEME:

### **Problem A: "Connection refused"**
- Server ist offline oder falsche IP
- Versuchen Sie: `ping automat.owona.de`

### **Problem B: "Permission denied"**
- Falsches Passwort
- Passwort ist: `LpXqTEPurwUu`

### **Problem C: "Host key verification failed"**
```bash
ssh-keygen -R automat.owona.de
ssh root@automat.owona.de
```

## 🔧 ALTERNATIVE METHODEN:

### **Option 1: Andere SSH-Syntax**
```bash
ssh -o PasswordAuthentication=yes root@automat.owona.de
```

### **Option 2: Mit expliziter IP**
```bash
ssh root@91.99.232.126
```

### **Option 3: Verbose Mode (für Debugging)**
```bash
ssh -v root@automat.owona.de
```

## 📋 NACH ERFOLGREICHER VERBINDUNG:

**Sie sehen:** `root@n8n-owown:~#`
**DANN:** Server-Befehle ausführen

## 🎯 TEST BEFEHL:
Nach erfolgreicher SSH-Verbindung testen Sie:
```bash
whoami
# Sollte ausgeben: root

hostname
# Sollte ausgeben: n8n-owown
```

**Versuchen Sie zuerst die SSH-Verbindung herzustellen!** 🚀

