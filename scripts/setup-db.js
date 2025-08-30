#!/usr/bin/env node

/**
 * BotChat Pro - Database Setup Script
 * Automated setup for Supabase connection and Prisma schema
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) {
    log('❌ .env.local Datei nicht gefunden!', 'red');
    log('Bitte erstelle eine .env.local Datei mit deinen Supabase Zugangsdaten:', 'yellow');
    log('', 'reset');
    log('DATABASE_URL="postgresql://[user]:[password]@[host]:[port]/[database]?sslmode=require"', 'blue');
    log('DIRECT_URL="postgresql://[user]:[password]@[host]:[port]/[database]?sslmode=require"', 'blue');
    log('', 'reset');
    process.exit(1);
  }
  log('✅ .env.local gefunden', 'green');
}

function generatePrismaClient() {
  try {
    log('🔧 Generiere Prisma Client...', 'blue');
    execSync('npx prisma generate', { stdio: 'inherit' });
    log('✅ Prisma Client generiert', 'green');
  } catch (error) {
    log('❌ Fehler beim Generieren des Prisma Clients', 'red');
    console.error(error.message);
    process.exit(1);
  }
}

function pushSchema() {
  try {
    log('📤 Push Prisma Schema zur Datenbank...', 'blue');
    execSync('npx prisma db push', { stdio: 'inherit' });
    log('✅ Schema erfolgreich zur Datenbank gepusht', 'green');
  } catch (error) {
    log('❌ Fehler beim Pushen des Schemas', 'red');
    console.error(error.message);
    process.exit(1);
  }
}

function seedDatabase() {
  try {
    log('🌱 Fülle Datenbank mit Demo-Daten...', 'blue');
    
    // Create seed script if it doesn't exist
    const seedPath = path.join(process.cwd(), 'prisma', 'seed.ts');
    if (!fs.existsSync(seedPath)) {
      const seedContent = `
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');
  
  // Create bot templates
  const templates = [
    {
      name: 'E-Commerce Kundenservice',
      description: 'Automatisierte Antworten für häufige Fragen zu Bestellungen, Versand und Rückgaben',
      category: 'e-commerce',
      flows: {
        nodes: [
          { id: '1', type: 'start', data: { label: 'Start' }, position: { x: 100, y: 100 } },
          { id: '2', type: 'message', data: { text: 'Willkommen! Wie kann ich helfen?' }, position: { x: 300, y: 100 } }
        ],
        edges: [
          { id: 'e1-2', source: '1', target: '2' }
        ]
      },
      settings: {
        welcomeMessage: 'Hallo! Ich bin Ihr digitaler Assistent.',
        fallbackMessage: 'Entschuldigung, das habe ich nicht verstanden.'
      }
    },
    {
      name: 'Lead Generation',
      description: 'Qualifiziert Leads und sammelt Kontaktdaten automatisch',
      category: 'lead-gen',
      flows: {
        nodes: [
          { id: '1', type: 'start', data: { label: 'Start' }, position: { x: 100, y: 100 } },
          { id: '2', type: 'message', data: { text: 'Interesse an unserem Service? Lassen Sie uns sprechen!' }, position: { x: 300, y: 100 } }
        ],
        edges: [
          { id: 'e1-2', source: '1', target: '2' }
        ]
      },
      settings: {
        welcomeMessage: 'Willkommen! Interesse an einer Beratung?',
        fallbackMessage: 'Können Sie das anders formulieren?'
      }
    }
  ];

  for (const template of templates) {
    await prisma.botTemplate.upsert({
      where: { name: template.name },
      update: template,
      create: template,
    });
  }

  console.log('✅ Templates erstellt');
  console.log('🎉 Database seeding abgeschlossen!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
`;
      fs.writeFileSync(seedPath, seedContent);
      log('📝 Seed-Datei erstellt', 'blue');
    }

    execSync('npx prisma db seed', { stdio: 'inherit' });
    log('✅ Demo-Daten eingefügt', 'green');
  } catch (error) {
    log('⚠️  Seeding optional - kann übersprungen werden', 'yellow');
  }
}

function openStudio() {
  try {
    log('🎨 Öffne Prisma Studio...', 'blue');
    log('Prisma Studio läuft auf: http://localhost:5555', 'green');
    execSync('npx prisma studio', { stdio: 'inherit' });
  } catch (error) {
    log('ℹ️  Prisma Studio kann manuell mit "npx prisma studio" gestartet werden', 'blue');
  }
}

function main() {
  log('🚀 BotChat Pro - Database Setup', 'bold');
  log('', 'reset');

  checkEnvFile();
  generatePrismaClient();
  pushSchema();
  seedDatabase();
  
  log('', 'reset');
  log('🎉 Database Setup abgeschlossen!', 'green');
  log('', 'reset');
  log('Next Steps:', 'bold');
  log('1. npm run dev - Starte den Development Server', 'blue');
  log('2. npx prisma studio - Öffne Prisma Studio (optional)', 'blue');
  log('3. Besuche http://localhost:3000 - Teste die App', 'blue');
  log('', 'reset');
}

if (require.main === module) {
  main();
}

module.exports = { main };
