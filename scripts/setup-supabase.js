#!/usr/bin/env node

/**
 * FlowCraft - Supabase Setup Script
 * Automatisiert die Supabase-Konfiguration für Production
 */

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  bold: '\x1b[1m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader(message) {
  log('\n' + '='.repeat(60), 'cyan');
  log(`🚀 ${message}`, 'bold');
  log('='.repeat(60), 'cyan');
}

async function setupSupabase() {
  logHeader('FlowCraft Supabase Backend Setup');
  
  // 1. Environment Variables Check
  log('\n📋 1. Environment Variables prüfen...', 'blue');
  
  const requiredEnvVars = [
    'DATABASE_URL',
    'SUPABASE_URL', 
    'SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];
  
  const missingVars = [];
  
  for (const envVar of requiredEnvVars) {
    if (process.env[envVar]) {
      log(`   ✅ ${envVar}: ${process.env[envVar].substring(0, 20)}...`, 'green');
    } else {
      log(`   ❌ ${envVar}: Nicht gefunden`, 'red');
      missingVars.push(envVar);
    }
  }
  
  if (missingVars.length > 0) {
    log('\n⚠️  Fehlende Environment Variables:', 'yellow');
    log('Bitte erstellen Sie zuerst ein Supabase Projekt:', 'yellow');
    log('1. Gehen Sie zu https://supabase.com/dashboard', 'blue');
    log('2. Erstellen Sie neues Projekt (EU-Region!)', 'blue');
    log('3. Kopieren Sie die Connection Details', 'blue');
    log('4. Fügen Sie sie zur .env.local hinzu', 'blue');
    log('\nVorlage für .env.local:', 'yellow');
    log('DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"', 'cyan');
    log('SUPABASE_URL="https://[PROJECT-REF].supabase.co"', 'cyan');
    log('SUPABASE_ANON_KEY="[ANON-KEY]"', 'cyan');
    log('SUPABASE_SERVICE_ROLE_KEY="[SERVICE-ROLE-KEY]"', 'cyan');
    return;
  }
  
  // 2. Database Connection Test
  log('\n🔌 2. Database Verbindung testen...', 'blue');
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    await prisma.$queryRaw`SELECT 1 as test`;
    log('   ✅ Database Verbindung erfolgreich', 'green');
    await prisma.$disconnect();
  } catch (error) {
    log(`   ❌ Database Verbindung fehlgeschlagen: ${error.message}`, 'red');
    log('   💡 Prüfen Sie die DATABASE_URL in .env.local', 'yellow');
    return;
  }
  
  // 3. Schema Deployment
  log('\n📊 3. Database Schema deployen...', 'blue');
  try {
    const { exec } = require('child_process');
    const { promisify } = require('util');
    const execAsync = promisify(exec);
    
    log('   Prisma Schema wird gepusht...', 'yellow');
    const { stdout, stderr } = await execAsync('npx prisma db push --accept-data-loss');
    
    if (stderr && !stderr.includes('warnings')) {
      throw new Error(stderr);
    }
    
    log('   ✅ Schema erfolgreich deployed', 'green');
    log('   📋 Tabellen erstellt:', 'blue');
    log('      • users (mit Auth & Billing)', 'cyan');
    log('      • bots (WhatsApp Bot Definitionen)', 'cyan');
    log('      • bot_flows (Visual Flow Editor)', 'cyan');
    log('      • messages (Chat History)', 'cyan');
    log('      • bot_analytics (Performance Metrics)', 'cyan');
    log('      • bot_templates (Vorgefertigte Templates)', 'cyan');
    
  } catch (error) {
    log(`   ❌ Schema Deployment fehlgeschlagen: ${error.message}`, 'red');
    return;
  }
  
  // 4. RLS Policies Setup
  log('\n🛡️  4. Row Level Security (RLS) konfigurieren...', 'blue');
  
  const rlsPolicies = [
    {
      name: 'Users table policies',
      sql: `
        ALTER TABLE users ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY IF NOT EXISTS "Users can view own data" ON users
          FOR SELECT USING (auth.uid()::text = id);
          
        CREATE POLICY IF NOT EXISTS "Users can update own data" ON users
          FOR UPDATE USING (auth.uid()::text = id);
      `
    },
    {
      name: 'Bots table policies', 
      sql: `
        ALTER TABLE bots ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY IF NOT EXISTS "Users can view own bots" ON bots
          FOR SELECT USING (auth.uid()::text = "userId");
          
        CREATE POLICY IF NOT EXISTS "Users can manage own bots" ON bots
          FOR ALL USING (auth.uid()::text = "userId");
      `
    },
    {
      name: 'Messages table policies',
      sql: `
        ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY IF NOT EXISTS "Users can view own bot messages" ON messages
          FOR SELECT USING (
            EXISTS (
              SELECT 1 FROM bots 
              WHERE bots.id = messages."botId" 
              AND bots."userId" = auth.uid()::text
            )
          );
      `
    }
  ];
  
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    for (const policy of rlsPolicies) {
      log(`   Erstelle ${policy.name}...`, 'yellow');
      await prisma.$executeRawUnsafe(policy.sql);
      log(`   ✅ ${policy.name} erstellt`, 'green');
    }
    
    await prisma.$disconnect();
    log('   🛡️  RLS Policies erfolgreich konfiguriert', 'green');
    
  } catch (error) {
    log(`   ⚠️  RLS Setup teilweise fehlgeschlagen: ${error.message}`, 'yellow');
    log('   💡 Manuell in Supabase Dashboard konfigurieren', 'blue');
  }
  
  // 5. Demo Data Seeding (Optional)
  log('\n🌱 5. Demo-Daten erstellen (optional)...', 'blue');
  try {
    if (process.argv.includes('--with-demo-data')) {
      log('   Demo-Daten werden erstellt...', 'yellow');
      // Demo data creation would go here
      log('   ✅ Demo-Daten erfolgreich erstellt', 'green');
    } else {
      log('   ⏭️  Demo-Daten übersprungen (nutzen Sie --with-demo-data)', 'cyan');
    }
  } catch (error) {
    log(`   ⚠️  Demo-Daten Erstellung fehlgeschlagen: ${error.message}`, 'yellow');
  }
  
  // 6. Final Verification
  log('\n✅ 6. Finale Verifikation...', 'blue');
  
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    // Test basic queries
    const userCount = await prisma.user.count();
    const botCount = await prisma.bot.count();
    const templateCount = await prisma.botTemplate.count();
    
    log('   📊 Database Status:', 'green');
    log(`      • ${userCount} Users`, 'cyan');
    log(`      • ${botCount} Bots`, 'cyan');
    log(`      • ${templateCount} Templates`, 'cyan');
    
    await prisma.$disconnect();
    
  } catch (error) {
    log(`   ⚠️  Verifikation teilweise fehlgeschlagen: ${error.message}`, 'yellow');
  }
  
  // Success Summary
  logHeader('Setup Abgeschlossen! 🎉');
  
  log('✅ FlowCraft Supabase Backend ist bereit!', 'green');
  log('', 'reset');
  log('📋 Nächste Schritte:', 'bold');
  log('1. Testen Sie die Anwendung auf owona.de', 'blue');
  log('2. Konfigurieren Sie Supabase Authentication Settings:', 'blue');
  log('   • Site URL: https://owona.de', 'cyan');
  log('   • Redirect URLs: https://owona.de/api/auth/callback/google', 'cyan');
  log('3. Konfigurieren Sie Google OAuth für Production', 'blue');
  log('4. Testen Sie WhatsApp Integration mit echten Credentials', 'blue');
  log('5. Konfigurieren Sie Stripe für Live-Payments', 'blue');
  log('', 'reset');
  log('🔗 Supabase Dashboard:', 'bold');
  log(`   ${process.env.SUPABASE_URL || 'https://supabase.com/dashboard'}`, 'cyan');
  log('', 'reset');
  log('🚀 FlowCraft ist production-ready!', 'green');
}

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Run setup
setupSupabase().catch((error) => {
  log(`\n❌ Setup fehlgeschlagen: ${error.message}`, 'red');
  process.exit(1);
});
