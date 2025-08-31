import { NextRequest, NextResponse } from 'next/server';

/**
 * WhatsApp API Test Endpoint
 * Simuliert 360dialog API für MCP Server Testing
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, message } = body;

    // Validierung
    if (!to || !message) {
      return NextResponse.json(
        { 
          error: 'Missing required fields: to, message',
          success: false 
        },
        { status: 400 }
      );
    }

    // Phone number validation (basic)
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phoneRegex.test(to)) {
      return NextResponse.json(
        { 
          error: 'Invalid phone number format. Use E.164 format (+49123456789)',
          success: false 
        },
        { status: 400 }
      );
    }

    // Simulate 360dialog API response
    const mockResponse = {
      success: true,
      messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'sent',
      to: to,
      message: message,
      timestamp: new Date().toISOString(),
      webhook: {
        url: `${process.env.NEXTAUTH_URL}/api/whatsapp/webhook`,
        status: 'configured'
      },
      provider: '360dialog',
      channel: 'whatsapp'
    };

    // Log für Debugging (in Production durch echte API ersetzen)
    console.log('📱 WhatsApp Test Message:', {
      to,
      message: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
      timestamp: mockResponse.timestamp
    });

    return NextResponse.json(mockResponse, { status: 200 });

  } catch (error) {
    console.error('WhatsApp API Test Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        success: false,
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    service: 'WhatsApp API Test',
    status: 'online',
    provider: '360dialog (simulation)',
    endpoints: {
      test: '/api/whatsapp/test',
      webhook: '/api/whatsapp/webhook'
    },
    documentation: 'https://docs.360dialog.com/whatsapp-api/whatsapp-api',
    timestamp: new Date().toISOString()
  });
}
