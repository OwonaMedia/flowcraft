# 🚀 Owona Media Agency - Manuelles Deployment

## 🎯 Aktuelle Situation

✅ **Domain ist live:** https://owona.de läuft bereits mit einer React-App
✅ **Server ist erreichbar:** Apache läuft auf dem Goneo-Hosting
✅ **Website-Dateien sind bereit:** Alle HTML/CSS/JS-Dateien erstellt

---

## 📋 Deployment-Optionen

### **Option 1: FTP-Client (Empfohlen)**

Da das automatische Script DNS-Probleme hat, verwende einen FTP-Client:

#### **Empfohlene FTP-Clients:**
- **FileZilla** (kostenlos, cross-platform)
- **Cyberduck** (macOS)
- **WinSCP** (Windows)

#### **FTP-Zugangsdaten:**
```
Server: ftp.goneo.de
Username: 163544f130388
Password: Afidi2008!
Port: 21 (Standard FTP)
Zielverzeichnis: /html oder /
```

#### **Dateien zum Upload:**
```
✅ index.html (Hauptseite)
✅ impressum.html (Impressum)
✅ datenschutz.html (Datenschutz)
✅ agb.html (AGB)
✅ widerruf.html (Widerruf)
✅ styles.css (Custom CSS)
✅ favicon.ico (Website-Icon)
✅ .htaccess (Apache-Konfiguration)
```

---

### **Option 2: Web-basiertes File Manager**

Goneo bietet normalerweise einen Web-File-Manager:

1. **Login bei Goneo:** https://www.goneo.de/
2. **Kundencenter öffnen**
3. **File Manager aufrufen**
4. **Dateien in /html/ Verzeichnis hochladen**

---

### **Option 3: Alternative FTP-Tools**

#### **macOS Terminal (lftp):**
```bash
# lftp installieren falls nicht vorhanden
brew install lftp

# FTP-Upload
lftp ftp://163544f130388:Afidi2008!@ftp.goneo.de
cd /html
mput *.html *.css *.ico .htaccess
quit
```

#### **Command-line FTP:**
```bash
ftp ftp.goneo.de
# Username: 163544f130388
# Password: Afidi2008!
cd /html
binary
mput *.html
mput *.css
mput *.ico
put .htaccess
quit
```

---

## 🔧 Nach dem Upload

### **1. Website testen:**
```bash
curl -I https://owona.de
```

### **2. Backup der aktuellen Seite:**
Falls du die React-App behalten möchtest, sichere sie vorher!

### **3. Subdomain für FlowCraft:**
- `flowcraft.owona.de` bei Goneo einrichten
- FlowCraft-Build separat hochladen

---

## 📱 Quick Manual Upload Guide

### **FileZilla Setup:**
1. **Download:** https://filezilla-project.org/download.php?type=client
2. **Neue Verbindung erstellen:**
   - Host: `ftp.goneo.de`
   - Username: `163544f130388`  
   - Password: `Afidi2008!`
   - Port: `21`
3. **Verbinden**
4. **Zum /html Verzeichnis navigieren**
5. **Alle Website-Dateien rüberziehen**

### **Dateien-Reihenfolge:**
1. **Erst:** `.htaccess` (Apache-Konfiguration)
2. **Dann:** Alle `.html` Dateien
3. **Dann:** `.css` und `.ico` Dateien
4. **Test:** https://owona.de aufrufen

---

## ⚡ Express-Upload (ZIP)

Du hast bereits eine fertige ZIP-Datei:
```
owona-website-ready.zip
```

**Inhalt:**
- Alle HTML-Dateien
- CSS und Assets
- Apache-Konfiguration
- Deployment-Scripts

**Upload-Strategie:**
1. ZIP-Datei auf Server hochladen
2. Server-seitig entpacken (falls möglich)
3. Oder lokal entpacken und Dateien einzeln hochladen

---

## 🎊 Post-Deployment

Nach erfolgreichem Upload:

### **1. Live-Test:**
🌍 **https://owona.de** - Sollte die neue Owona Media Agency Seite zeigen

### **2. Funktionalität prüfen:**
- ✅ Navigation funktioniert
- ✅ Kontaktformular responsive
- ✅ Alle Rechtsseiten erreichbar
- ✅ Mobile Ansicht korrekt

### **3. FlowCraft Integration:**
- Subdomain `flowcraft.owona.de` einrichten
- FlowCraft-Build hochladen  
- Link von Hauptseite testen

---

**🚀 Ready für Launch!**

Welche Deployment-Option möchtest du verwenden?
