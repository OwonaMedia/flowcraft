/**
 * Stripe Checkout API Route
 * Erstellt Stripe Checkout Sessions für FlowCraft Subscriptions
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { createCheckoutSession, PRICING_PLANS } from '@/lib/stripe';

const CheckoutRequestSchema = z.object({
  planId: z.enum(['starter', 'professional', 'enterprise']),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || !session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const { planId, successUrl, cancelUrl } = CheckoutRequestSchema.parse(body);

    // Get pricing plan details
    const plan = PRICING_PLANS[planId];
    
    if (!plan.stripePriceId) {
      return NextResponse.json(
        { error: 'Pricing plan not configured' },
        { status: 400 }
      );
    }

    // Create Stripe checkout session
    const checkoutSession = await createCheckoutSession({
      priceId: plan.stripePriceId,
      userId: session.user.id,
      userEmail: session.user.email,
      successUrl: successUrl || `${process.env.NEXTAUTH_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: cancelUrl || `${process.env.NEXTAUTH_URL}/dashboard/settings?cancelled=true`,
    });

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });

  } catch (error) {
    console.error('Checkout session creation failed:', error);

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

export async function GET() {
  return NextResponse.json(
    { message: 'Use POST to create checkout session' },
    { status: 405 }
  );
}

