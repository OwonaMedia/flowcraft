# 📝 NGINX KONFIGURATION EINGEBEN

## 🎯 **SIE SIND HIER:** `GNU nano 7.2 /etc/nginx/sites-available/flowcraft`

**Die Datei ist leer und wartet auf Ihre Eingabe!**

## ✍️ **FOLGENDE KONFIGURATION EINGEBEN:**

**Kopieren Sie diesen Text komplett und fügen Sie ihn ein:**

```nginx
server {
    listen 80;
    server_name automat.owona.de;

    # n8n auf Root (UNBERÜHRT)
    location / {
        proxy_pass http://localhost:5678;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # FlowCraft auf /flowcraft/
    location /flowcraft/ {
        proxy_pass http://localhost:3001/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 80;
    server_name owona.de www.owona.de;

    # Direkte Weiterleitung zu FlowCraft
    location / {
        proxy_pass http://localhost:3001/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 💾 **SPEICHERN & BEENDEN:**

**Nach dem Einfügen:**

1. **Speichern:** `Ctrl + O` (dann Enter bestätigen)
2. **Beenden:** `Ctrl + X`

## 🚀 **DANACH DIESE BEFEHLE:**

```bash
# Nginx Config aktivieren
sudo ln -s /etc/nginx/sites-available/flowcraft /etc/nginx/sites-enabled/

# Config testen
sudo nginx -t

# Nginx neu laden
sudo systemctl reload nginx

# Test
curl -I http://automat.owona.de/flowcraft/
```

## 🎯 **ZIEL:**
Nach dem Speichern können Sie FlowCraft über `http://automat.owona.de/flowcraft/` erreichen!

**JETZT: Text einfügen → Ctrl+O → Enter → Ctrl+X** ✍️

