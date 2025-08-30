/**
 * Analytics API Routes
 * DSGVO-konforme Analytics Endpoints für FlowCraft
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { trackEvent, getDashboardAnalytics, getBotAnalytics } from '@/lib/analytics';

// Track Event Schema
const TrackEventSchema = z.object({
  event: z.enum([
    'page_view',
    'bot_created',
    'bot_published',
    'message_sent',
    'message_received',
    'flow_completed',
    'user_registered',
    'subscription_started',
    'subscription_cancelled',
    'api_call',
    'error_occurred',
  ]),
  properties: z.object({
    botId: z.string().optional(),
    flowId: z.string().optional(),
    sessionId: z.string().optional(),
    path: z.string().optional(),
    duration: z.number().optional(),
    errorMessage: z.string().optional(),
    subscriptionPlan: z.string().optional(),
    revenue: z.number().optional(),
    metadata: z.record(z.any()).optional(),
  }).optional(),
});

// Get Analytics Schema
const GetAnalyticsSchema = z.object({
  type: z.enum(['dashboard', 'bot']).optional().default('dashboard'),
  botId: z.string().optional(),
  days: z.coerce.number().min(1).max(365).optional().default(30),
});

/**
 * POST /api/analytics - Track an event
 */
export async function POST(request: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const { event, properties = {} } = TrackEventSchema.parse(body);

    // Add server-side properties
    const serverProperties = {
      ...properties,
      userId: session.user.id,
      userAgent: request.headers.get('user-agent') || undefined,
      ip: getClientIp(request),
      referrer: request.headers.get('referer') || undefined,
    };

    // Track the event
    await trackEvent(event, serverProperties);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Analytics tracking failed:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/analytics - Get analytics data
 */
export async function GET(request: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const query = GetAnalyticsSchema.parse({
      type: searchParams.get('type'),
      botId: searchParams.get('botId'),
      days: searchParams.get('days'),
    });

    let analytics;

    if (query.type === 'bot' && query.botId) {
      // Get bot analytics
      analytics = await getBotAnalytics(query.botId, query.days);
    } else {
      // Get dashboard analytics
      analytics = await getDashboardAnalytics(session.user.id, query.days);
    }

    return NextResponse.json(analytics);

  } catch (error) {
    console.error('Analytics retrieval failed:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Extract client IP from request
 */
function getClientIp(request: NextRequest): string | undefined {
  // Check various headers for the real IP
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  if (cfConnectingIp) {
    return cfConnectingIp;
  }
  
  // Fallback to connection remote address
  return request.ip;
}

