# 🤖 FlowCraft MCP Server

**Model Context Protocol Server für WhatsApp Bot Management**

## 🚀 Features

- **Bot Flow Management:** Erstelle, bearbeite und verwalte WhatsApp Bot Flows
- **Supabase Integration:** GDPR-konforme Datenspeicherung in EU
- **Real-time Analytics:** Anonymisierte Bot-Performance Metriken
- **WhatsApp API Testing:** 360dialog Integration Testing
- **Flow Validation:** Syntax-Prüfung vor Deployment

## 📋 Voraussetzungen

- Node.js 18+
- TypeScript
- Supabase Account (EU Region)
- FlowCraft Backend

## ⚡ Installation

```bash
cd mcp-server
npm install
npm run build
```

## 🔧 Konfiguration

Erstelle `.env` Datei:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
FLOWCRAFT_BASE_URL=http://91.99.232.126:3001
```

## 🎯 Verfügbare Tools

### 1. `create_bot_flow`
Erstellt einen neuen WhatsApp Bot mit Flows

```json
{
  "name": "Kundenservice Bot",
  "description": "Automatisierte Kundenbetreuung",
  "triggerKeywords": ["hilfe", "support", "problem"],
  "flows": [
    {
      "id": "start",
      "type": "message",
      "content": {
        "text": "Hallo! Wie kann ich Ihnen helfen?"
      },
      "nextNodes": ["menu"]
    }
  ],
  "isActive": true
}
```

### 2. `get_user_bots`
Holt alle Bots eines Users mit Pagination

```json
{
  "userId": "uuid-here",
  "limit": 10,
  "offset": 0
}
```

### 3. `update_bot_status`
Aktiviert/Deaktiviert einen Bot

```json
{
  "botId": "bot-uuid",
  "isActive": false,
  "userId": "user-uuid"
}
```

### 4. `get_bot_analytics`
GDPR-konforme Analytics

```json
{
  "botId": "bot-uuid",
  "timeframe": "7d",
  "metrics": ["messages", "users", "conversions"]
}
```

### 5. `test_whatsapp_connection`
Testet WhatsApp API Verbindung

```json
{
  "phoneNumber": "+49123456789",
  "message": "Test Nachricht"
}
```

### 6. `validate_flow_syntax`
Validiert Flow-Konfiguration

```json
{
  "flows": [
    {
      "id": "node1",
      "type": "message",
      "content": { "text": "Hallo" }
    }
  ]
}
```

## 🏃‍♂️ Ausführung

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

### Als MCP Server
```bash
# Global installieren
npm install -g .

# Verwenden
flowcraft-mcp
```

## 🔒 GDPR Compliance

- ✅ Alle Daten in EU (Frankfurt)
- ✅ Anonymisierte Analytics
- ✅ Explizite Consent-Tracking
- ✅ Right to Deletion
- ✅ Data Minimization

## 🌐 API Endpoints

Der MCP Server kommuniziert mit:

- **Supabase:** Datenspeicherung
- **FlowCraft Backend:** Bot Management
- **360dialog API:** WhatsApp Integration

## 📊 Response Format

Alle Tools geben strukturierte JSON Responses zurück:

```json
{
  "success": true,
  "message": "Operation erfolgreich",
  "data": {
    // Tool-spezifische Daten
  }
}
```

## 🛠️ Development

### Build
```bash
npm run build
```

### Test
```bash
npm test
```

### Watch Mode
```bash
npm run dev
```

## 📄 Lizenz

MIT License - Siehe LICENSE Datei

---

**🌟 FlowCraft MCP Server - Powered by AI, Optimized for Germany** 🇩🇪
