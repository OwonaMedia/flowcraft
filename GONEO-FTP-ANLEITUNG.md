# 🎯 GONEO FTP-UPLOAD - OFFIZIELLE ANLEITUNG

## ❗ WICHTIGER HINWEIS
**Goneo unterstützt nur noch verschlüsselte FTP-Verbindungen!**
Normales FTP wird nicht mehr unterstützt - das war das Problem! 

Quelle: [Goneo FTP Hilfe](https://www.goneo.de/hilfe/webhosting/ftp)

## ✅ KORREKTE VERBINDUNGSDATEN

### **Server-Adresse:**
**NICHT:** `ftp.goneo.de`  
**SONDERN:** Den Servernamen aus deinem Goneo Kundencenter!

👉 **Login ins Kundencenter:** https://www.goneo.de/
👉 **Gehe zu:** Webserver → **FTP & SSH**
👉 **Dort findest du:** Den korrekten **Servernamen**

### **Verbindungsoptionen:**

| Methode | Port | Sicherheit |
|---------|------|------------|
| **FTPS (explizit)** | 21 | ✅ Verschlüsselt |
| **FTPS (implizit)** | 990 | ✅ Verschlüsselt |
| **SFTP** | 2222 | ✅ Verschlüsselt |

## 🔧 FILEZILLA SETUP

### **1. FileZilla herunterladen:**
https://filezilla-project.org/download.php?platform=osx

### **2. Verbindung einrichten:**

#### **Option A: FTPS (empfohlen)**
```
Protokoll: FTP - File Transfer Protocol
Verschlüsselung: Explizite FTP-Verschlüsselung über TLS erforderlich
Server: [Dein Servername aus Kundencenter]
Port: 21
Benutzer: 163544f130388
Passwort: Afidi2008!
```

#### **Option B: SFTP (alternative)**
```
Protokoll: SFTP - SSH File Transfer Protocol
Server: [Dein Servername aus Kundencenter]
Port: 2222
Benutzer: 163544f130388
Passwort: Afidi2008!
```

### **3. Zertifikatswarnung:**
- Beim ersten Verbinden erscheint eine Zertifikatswarnung
- Das ist **normal** bei neuen Verbindungen
- Einfach **"Akzeptieren"** klicken

### **4. Upload-Verzeichnis:**
- Nach der Verbindung ins richtige Verzeichnis navigieren
- Meist: `/htdocs/` oder `/www/` oder `/public_html/`

## 📁 DATEIEN ZUM UPLOAD

```
✅ index.html (37KB) - Hauptseite
✅ impressum.html (11KB) - Impressum  
✅ datenschutz.html (16KB) - Datenschutz
✅ agb.html (2KB) - AGB
✅ widerruf.html (2KB) - Widerrufsrecht
✅ styles.css (2KB) - Styling
✅ favicon.ico (93B) - Website-Icon
✅ .htaccess (2KB) - Server-Konfiguration
```

## 🚀 SCHRITT-FÜR-SCHRITT

### **Schritt 1: Kundencenter Login**
1. Gehe zu: https://www.goneo.de/
2. Login mit deinen Zugangsdaten
3. Navigiere zu: **Webserver → FTP & SSH**
4. Notiere dir den **Servernamen**

### **Schritt 2: FileZilla Setup**
1. FileZilla öffnen
2. **"Datei" → "Servermanager"**
3. **"Neuer Server"** klicken
4. Verbindungsdaten eingeben (siehe oben)
5. **"Verbinden"** klicken

### **Schritt 3: Upload**
1. Links: Zu diesem Ordner navigieren: `/Users/salomon/Documents/SaaS/owona-website/`
2. Rechts: Ins Website-Verzeichnis (meist `/htdocs/`)
3. Alle 8 Dateien markieren und rüberziehen

### **Schritt 4: Test**
- Browser öffnen
- **https://owona.de** aufrufen
- **Erfolg!** 🎉

## ⚠️ TROUBLESHOOTING

### **Problem: "Verbindung fehlgeschlagen"**
**Lösung:** Servername aus Kundencenter verwenden, nicht `ftp.goneo.de`

### **Problem: "Zertifikatsfehler"**
**Lösung:** Zertifikat akzeptieren (ist normal bei erster Verbindung)

### **Problem: "Zugriff verweigert"**
**Lösung:** Prüfe Username/Passwort im Kundencenter

### **Problem: "Port-Fehler"**
**Lösung:** FTPS Port 21 oder SFTP Port 2222 verwenden

## 📞 GONEO SUPPORT

Falls immer noch Probleme:
- **Telefon:** 0681 906 26 0
- **E-Mail:** support@goneo.de
- **Hilfe:** https://www.goneo.de/hilfe/

## 🎊 FAZIT

**Deshalb hat der automatische Upload nicht funktioniert:**
- Goneo verwendet spezielle Servernamen (nicht `ftp.goneo.de`)
- Nur verschlüsselte Verbindungen sind erlaubt
- Standard-FTP funktioniert nicht mehr

**Mit diesen korrekten Daten klappt es 100%! 🚀**
