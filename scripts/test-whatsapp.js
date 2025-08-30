#!/usr/bin/env node

/**
 * BotChat Pro - WhatsApp API Test Script
 * Test connection to 360dialog WhatsApp Business API
 */

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

async function testWhatsAppConnection() {
  log('🚀 Testing WhatsApp Business API Connection...', 'bold');
  log('', 'reset');

  // Check environment variables
  const apiUrl = process.env.WHATSAPP_API_URL;
  const apiToken = process.env.WHATSAPP_API_TOKEN;

  if (!apiUrl || !apiToken) {
    log('❌ Missing WhatsApp API credentials in .env.local:', 'red');
    log('   WHATSAPP_API_URL', !apiUrl ? '❌' : '✅');
    log('   WHATSAPP_API_TOKEN', !apiToken ? '❌' : '✅');
    log('', 'reset');
    log('Please add these to your .env.local file:', 'yellow');
    log('WHATSAPP_API_URL="https://waba-v2.360dialog.io"', 'blue');
    log('WHATSAPP_API_TOKEN="your-360dialog-token"', 'blue');
    return;
  }

  log('✅ Environment variables found', 'green');
  log(`   API URL: ${apiUrl}`, 'blue');
  log(`   Token: ${apiToken.substring(0, 10)}...`, 'blue');
  log('', 'reset');

  // Test API connectivity
  try {
    log('🔍 Testing API connectivity...', 'blue');
    
    const response = await fetch(`${apiUrl}/v1/configs/webhook`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'D360-API-KEY': apiToken,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      log('✅ API connection successful', 'green');
      const data = await response.json();
      log(`   Webhook URL: ${data.url || 'Not configured'}`, 'blue');
    } else {
      log(`❌ API connection failed: ${response.status} ${response.statusText}`, 'red');
      
      if (response.status === 401) {
        log('   Check your API token - it might be invalid or expired', 'yellow');
      } else if (response.status === 403) {
        log('   Access denied - check your account permissions', 'yellow');
      }
    }
  } catch (error) {
    log(`❌ Network error: ${error.message}`, 'red');
    log('   Check your internet connection and API URL', 'yellow');
  }

  log('', 'reset');

  // Test webhook configuration
  try {
    log('🔗 Testing webhook configuration...', 'blue');
    
    const webhookUrl = process.env.NEXT_PUBLIC_APP_URL 
      ? `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/whatsapp`
      : 'http://localhost:3000/api/webhooks/whatsapp';

    log(`   Expected webhook URL: ${webhookUrl}`, 'blue');
    
    // In production, you would configure this webhook URL with 360dialog
    log('   ℹ️  To configure webhook, contact your 360dialog representative', 'yellow');
    
  } catch (error) {
    log(`❌ Webhook test error: ${error.message}`, 'red');
  }

  log('', 'reset');
  log('📋 Next Steps:', 'bold');
  log('1. If API connection failed, verify your 360dialog credentials', 'blue');
  log('2. Configure webhook URL with 360dialog support', 'blue');
  log('3. Test bot responses with a real WhatsApp number', 'blue');
  log('4. Monitor webhook calls in the Next.js console', 'blue');
  log('', 'reset');
  
  log('🎯 For 360dialog setup help:', 'bold');
  log('   Website: https://www.360dialog.com/', 'blue');
  log('   Docs: https://docs.360dialog.com/', 'blue');
  log('   Support: support@360dialog.com', 'blue');
}

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Run the test
testWhatsAppConnection().catch(console.error);
