/**
 * FlowCraft - Database Seeding Script
 * Erstellt Demo-Daten für die WhatsApp Bot SaaS-Plattform
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting FlowCraft database seeding...');

  // Demo User erstellen
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@flowcraft.de' },
    update: {},
    create: {
      email: 'demo@flowcraft.de',
      name: 'Demo User',
      consentGiven: true,
      consentGivenAt: new Date(),
      subscriptionTier: 'professional',
      currentPlan: 'professional',
      subscriptionStatus: 'active',
    },
  });

  console.log('✅ Demo user created:', demoUser.email);

  // Demo Bot Templates erstellen
  const templates = [
    {
      name: 'Kundenservice Bot',
      description: 'Automatisierter Kundenservice mit FAQ und Weiterleitung',
      category: 'support',
      flows: {
        nodes: [
          {
            id: 'start',
            type: 'start',
            position: { x: 100, y: 100 },
            data: { label: 'Start' },
          },
          {
            id: 'welcome',
            type: 'message',
            position: { x: 300, y: 100 },
            data: { 
              message: '👋 Hallo! Ich bin Ihr FlowCraft Kundenservice-Assistent.\n\nWie kann ich Ihnen heute helfen?',
              quickReplies: ['📦 Bestellung verfolgen', '↩️ Rückgabe', '🔧 Technischer Support', '👨‍💼 Mit Mensch sprechen']
            },
          },
          {
            id: 'menu',
            type: 'condition',
            position: { x: 550, y: 100 },
            data: { 
              conditions: [
                { keyword: 'bestellung', target: 'track-order' },
                { keyword: 'verfolgen', target: 'track-order' },
                { keyword: 'rückgabe', target: 'return-info' },
                { keyword: 'support', target: 'tech-support' },
                { keyword: 'technisch', target: 'tech-support' },
                { keyword: 'mensch', target: 'human-handoff' },
                { keyword: 'mitarbeiter', target: 'human-handoff' }
              ]
            },
          },
          {
            id: 'track-order',
            type: 'collect-input',
            position: { x: 300, y: 300 },
            data: { 
              prompt: '📦 Gerne helfe ich bei der Sendungsverfolgung!\n\nBitte geben Sie Ihre Bestellnummer ein:',
              variable: 'order_number',
              inputType: 'text'
            },
          },
          {
            id: 'return-info',
            type: 'message', 
            position: { x: 500, y: 300 },
            data: { 
              message: '↩️ **Rückgabe-Information**\n\n✅ Rückgabezeit: 14 Tage\n✅ Kostenloser Rückversand\n✅ Geld-zurück-Garantie\n\n📋 Weitere Details: https://shop.de/rueckgabe\n\nBenötigen Sie einen Rückgabeschein?'
            },
          },
          {
            id: 'tech-support',
            type: 'collect-input',
            position: { x: 700, y: 300 },
            data: { 
              prompt: '🔧 **Technischer Support**\n\nBeschreiben Sie bitte kurz Ihr Problem:',
              variable: 'tech_issue',
              inputType: 'text'
            },
          },
          {
            id: 'human-handoff',
            type: 'handoff',
            position: { x: 900, y: 300 },
            data: { 
              message: '👨‍💼 **Verbindung mit Mitarbeiter**\n\nIch verbinde Sie jetzt mit einem unserer Kundenservice-Mitarbeiter.\n\n⏱️ Durchschnittliche Wartezeit: 2-3 Minuten\n\nBitte haben Sie einen Moment Geduld...',
              department: 'customer-service'
            },
          },
        ],
        edges: [
          { id: 'e1', source: 'start', target: 'welcome' },
          { id: 'e2', source: 'welcome', target: 'menu' },
          { id: 'e3', source: 'menu', target: 'track-order' },
          { id: 'e4', source: 'menu', target: 'return-info' },
          { id: 'e5', source: 'menu', target: 'tech-support' },
          { id: 'e6', source: 'menu', target: 'human-handoff' },
        ],
      },
      settings: {
        welcomeMessage: 'Willkommen bei unserem Kundenservice!',
        fallbackMessage: 'Entschuldigung, das habe ich nicht verstanden. Tippen Sie "Hilfe" für das Hauptmenü.',
        aiEnabled: true,
      },
    },
    {
      name: 'Lead Generation Bot',
      description: 'Qualifiziert Leads und sammelt Kontaktdaten',
      category: 'lead-gen',
      flows: {
        nodes: [
          {
            id: 'start',
            type: 'start',
            position: { x: 100, y: 100 },
            data: { label: 'Start' },
          },
          {
            id: 'intro',
            type: 'message',
            position: { x: 300, y: 100 },
            data: { 
              message: '🚀 **Willkommen bei FlowCraft!**\n\nIch helfe Ihnen gerne bei der Auswahl unserer WhatsApp Automation-Services.\n\n💡 Was interessiert Sie am meisten?',
              quickReplies: ['🤖 WhatsApp Bots', '📈 Marketing Automation', '🛠️ Custom Lösung', '💰 Preise']
            },
          },
          {
            id: 'interest',
            type: 'collect-input',
            position: { x: 550, y: 100 },
            data: { 
              prompt: 'Perfekt! Erzählen Sie mir mehr über Ihr Projekt:',
              variable: 'interest',
              inputType: 'text'
            },
          },
          {
            id: 'qualify',
            type: 'message',
            position: { x: 300, y: 300 },
            data: { 
              message: '🎯 **{{interest}}** ist ein wichtiger Bereich!\n\nWo stehen Sie aktuell mit Ihrem Unternehmen?'
            },
          },
          {
            id: 'business-status',
            type: 'collect-input',
            position: { x: 550, y: 300 },
            data: { 
              prompt: 'Ihr Geschäftsstatus:',
              variable: 'business_status',
              inputType: 'choice',
              choices: ['🏢 Bereits im Geschäft', '🚀 Planung/Start', '👀 Nur interessiert']
            },
          },
          {
            id: 'contact-info',
            type: 'collect-input',
            position: { x: 800, y: 300 },
            data: { 
              prompt: '📧 **Fast geschafft!**\n\nDarf ich Ihre E-Mail für weitere Informationen?',
              variable: 'email',
              inputType: 'email'
            },
          },
          {
            id: 'thank-you',
            type: 'message',
            position: { x: 1050, y: 300 },
            data: { 
              message: '🙌 **Vielen Dank!**\n\n✅ Ich sende Ihnen passende Informationen zu **{{interest}}**\n✅ Ein FlowCraft-Berater meldet sich in 24h bei Ihnen\n\n🎁 **Bonus:** Kostenlose Beratung im Wert von 200€!\n\n📱 Bleiben Sie dran für Updates!'
            },
          },
        ],
        edges: [
          { id: 'e1', source: 'start', target: 'intro' },
          { id: 'e2', source: 'intro', target: 'interest' },
          { id: 'e3', source: 'interest', target: 'qualify' },
          { id: 'e4', source: 'qualify', target: 'business-status' },
          { id: 'e5', source: 'business-status', target: 'contact-info' },
          { id: 'e6', source: 'contact-info', target: 'thank-you' },
        ],
      },
      settings: {
        welcomeMessage: 'Willkommen bei FlowCraft Lead Generation!',
        fallbackMessage: 'Möchten Sie mehr über unsere Services erfahren?',
        aiEnabled: true,
      },
    },
    {
      name: 'Terminbuchung Bot',
      description: 'Automatische Terminvereinbarung mit Kalendersync',
      category: 'appointment',
      flows: {
        nodes: [
          {
            id: 'start',
            type: 'start',
            position: { x: 100, y: 100 },
            data: { label: 'Start' },
          },
          {
            id: 'welcome',
            type: 'message',
            position: { x: 300, y: 100 },
            data: { 
              message: '📅 **FlowCraft Terminbuchung**\n\nGerne vereinbare ich einen Termin für Sie!\n\nWelche Art von Termin benötigen Sie?',
              quickReplies: ['💼 Beratungsgespräch', '🛠️ Demo Session', '🔧 Support Termin', '📞 Telefonat']
            },
          },
          {
            id: 'appointment-type',
            type: 'collect-input',
            position: { x: 550, y: 100 },
            data: { 
              prompt: 'Perfekt! Wann passt es Ihnen am besten?',
              variable: 'appointment_type',
              inputType: 'choice',
              choices: ['🌅 Vormittag (9-12h)', '🌞 Mittag (12-15h)', '🌇 Nachmittag (15-18h)']
            },
          },
          {
            id: 'contact-details',
            type: 'collect-input',
            position: { x: 300, y: 300 },
            data: { 
              prompt: '📧 Bitte geben Sie Ihre E-Mail-Adresse ein für die Terminbestätigung:',
              variable: 'email',
              inputType: 'email'
            },
          },
          {
            id: 'confirmation',
            type: 'message',
            position: { x: 550, y: 300 },
            data: { 
              message: '✅ **Termin erfolgreich angefragt!**\n\n📋 **Details:**\n• Art: {{appointment_type}}\n• Kontakt: {{email}}\n\n📧 Sie erhalten in wenigen Minuten eine Bestätigung per E-Mail\n📱 Bei Fragen einfach hier schreiben!\n\n🚀 Wir freuen uns auf Sie!'
            },
          },
        ],
        edges: [
          { id: 'e1', source: 'start', target: 'welcome' },
          { id: 'e2', source: 'welcome', target: 'appointment-type' },
          { id: 'e3', source: 'appointment-type', target: 'contact-details' },
          { id: 'e4', source: 'contact-details', target: 'confirmation' },
        ],
      },
      settings: {
        welcomeMessage: 'Willkommen zur FlowCraft Terminbuchung!',
        fallbackMessage: 'Für Hilfe bei der Terminbuchung schreiben Sie "Hilfe".',
        aiEnabled: false,
      },
    },
  ];

  // Bot Templates erstellen
  for (const template of templates) {
    const botTemplate = await prisma.botTemplate.create({
      data: {
        name: template.name,
        description: template.description,
        category: template.category,
        flows: template.flows,
        settings: template.settings,
        isPublic: true,
        usageCount: Math.floor(Math.random() * 100) + 10, // Random usage count
      },
    });

    console.log(`✅ Template created: ${botTemplate.name}`);
  }

  // Demo Bot für User erstellen
  const demoBot = await prisma.bot.create({
    data: {
      name: 'Mein Erster FlowCraft Bot',
      description: 'Ein Demo-Bot zum Testen aller FlowCraft Features',
      isActive: true,
      isPublished: false,
      welcomeMessage: 'Willkommen bei meinem ersten FlowCraft Bot! 🤖',
      fallbackMessage: 'Entschuldigung, das habe ich nicht verstanden. Können Sie das anders formulieren?',
      userId: demoUser.id,
      aiEnabled: true,
      aiModel: 'gpt-3.5-turbo',
    },
  });

  // Demo Flow für den Bot erstellen
  const demoFlow = await prisma.botFlow.create({
    data: {
      name: 'Willkommens-Flow',
      description: 'Einfacher Begrüßungsflow für neue Kontakte',
      triggerType: 'always',
      botId: demoBot.id,
      nodes: {
        nodes: [
          {
            id: 'start',
            type: 'start',
            position: { x: 100, y: 100 },
            data: { label: 'Start' },
          },
          {
            id: 'welcome',
            type: 'message',
            position: { x: 300, y: 100 },
            data: { 
              message: '🎉 **Willkommen bei FlowCraft!**\n\nIch bin Ihr persönlicher WhatsApp-Assistent.\n\n✨ Hier können Sie:\n• Fragen stellen\n• Termine buchen\n• Support erhalten\n\nWie kann ich Ihnen helfen?',
              quickReplies: ['ℹ️ Info', '📅 Termin', '🆘 Hilfe']
            },
          },
          {
            id: 'end',
            type: 'end',
            position: { x: 500, y: 100 },
            data: { label: 'Ende' },
          },
        ],
      },
      edges: {
        edges: [
          { id: 'e1', source: 'start', target: 'welcome' },
          { id: 'e2', source: 'welcome', target: 'end' },
        ],
      },
    },
  });

  console.log(`✅ Demo bot created: ${demoBot.name}`);
  console.log(`✅ Demo flow created: ${demoFlow.name}`);

  // Demo Analytics Daten erstellen
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    await prisma.botAnalytics.create({
      data: {
        botId: demoBot.id,
        date: date,
        messagesReceived: Math.floor(Math.random() * 50) + 10,
        messagesSent: Math.floor(Math.random() * 80) + 20,
        uniqueContacts: Math.floor(Math.random() * 25) + 5,
        avgResponseTime: Math.random() * 5 + 1, // 1-6 seconds
        botResponseRate: Math.random() * 0.2 + 0.8, // 80-100%
        flowsTriggered: {
          'welcome-flow': Math.floor(Math.random() * 30) + 5,
          'help-flow': Math.floor(Math.random() * 10) + 1,
        },
        conversionsCount: Math.floor(Math.random() * 5) + 1,
      },
    });
  }

  console.log('✅ Demo analytics data created');

  console.log('\n🎉 FlowCraft database seeding completed successfully!');
  console.log('\n📊 Created:');
  console.log(`   • 1 Demo User (demo@flowcraft.de)`);
  console.log(`   • 3 Bot Templates`);
  console.log(`   • 1 Demo Bot with Flow`);
  console.log(`   • 7 days of Analytics data`);
  console.log('\n🚀 Ready to test FlowCraft at http://localhost:3000');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
