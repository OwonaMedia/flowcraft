# 🔧 GITHUB BRANCH PROBLEM LÖSEN

## ❗ PROBLEM:
Supabase kann Branch "main" nicht finden, weil das Repository möglicherweise leer ist oder der Push nicht funktioniert hat.

## ✅ LÖSUNG:

### 1️⃣ **Git Status prüfen:**
```bash
git status
git log --oneline
```

### 2️⃣ **Falls noch keine Commits vorhanden - ersten Commit machen:**
```bash
git add .
git commit -m "Initial FlowCraft deployment"
```

### 3️⃣ **Remote Branch erstellen und pushen:**
```bash
git push -u origin main
```

### 4️⃣ **Fallback: Master Branch verwenden (falls main nicht funktioniert):**
```bash
git checkout -b master
git push -u origin master
```

### 5️⃣ **GitHub Repository direkt prüfen:**
- Gehen Sie zu: https://github.com/OwonaMedia/flowcraft
- Prüfen Sie ob Dateien sichtbar sind
- Prüfen Sie welche Branches existieren (Dropdown neben Repository-Name)

### 6️⃣ **In Supabase versuchen:**
- **Falls `main` nicht geht:** Versuchen Sie `master`
- **Falls gar nichts geht:** Repository ist noch leer

## 🔍 **DEBUGGING:**

### Option A: Repository ist leer
```bash
echo "# FlowCraft" > README.md
git add README.md
git commit -m "Initial commit"
git push -u origin main
```

### Option B: SSH vs HTTPS Problem
```bash
git remote set-url origin https://github.com/OwonaMedia/flowcraft.git
git push -u origin main
```

## 🎯 **NACH DEM FIX:**
- Zurück zu Supabase
- GitHub Integration neu versuchen
- Verfügbare Branches sollten jetzt sichtbar sein

**Führen Sie diese Schritte der Reihe nach aus!**

