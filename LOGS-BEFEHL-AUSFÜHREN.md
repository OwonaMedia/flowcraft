# 🔍 LOGS BEFEHL AUSFÜHREN

## ❗ WICHTIG:
`pm2 logs flowcraft --lines 30` ist ein **TERMINAL-BEFEHL**, keine Datei!

## ✅ SO FÜHREN SIE DEN BEFEHL AUS:

### **1️⃣ Im SSH-Terminal auf dem Server eingeben:**
```bash
pm2 logs flowcraft --lines 30
```

### **2️⃣ Das zeigt dann sowas wie:**
```
[TAILING] Tailing last 30 lines for [flowcraft] process

/root/.pm2/logs/flowcraft-error.log last 30 lines:
0|flowcraf | Error: Cannot find module '@/components/ui/button'
0|flowcraf | ReferenceError: document is not defined
0|flowcraf | TypeError: Cannot read property 'supabase' of undefined
... (weitere Error-Meldungen)
```

### **3️⃣ TEILEN SIE DIE ERROR-MELDUNGEN MIT MIR!**

## 🔧 ALTERNATIVE BEFEHLE:

```bash
# Nur Error Logs
pm2 logs flowcraft --err --lines 20

# Live Logs (läuft kontinuierlich)
pm2 logs flowcraft

# Alle PM2 Prozesse
pm2 monit
```

## 📋 DEBUGGING REIHENFOLGE:
1. **SSH-Terminal öffnen** (falls nicht schon offen)
2. **`pm2 logs flowcraft --lines 30` eingeben**
3. **Error-Meldungen kopieren**
4. **Mir die Errors zeigen**

## 🎯 WAS ICH ERWARTE:
Error-Meldungen wie:
- `Cannot find module...`
- `ReferenceError...`  
- `TypeError...`
- `SyntaxError...`

**FÜHREN SIE DEN BEFEHL IM SSH-TERMINAL AUS UND TEILEN SIE DIE ERRORS MIT MIR!** 🔍

