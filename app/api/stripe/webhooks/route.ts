/**
 * Stripe Webhooks Handler
 * Verarbeitet Stripe Events für Subscription-Management
 */

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { validateWebhookSignature, getPlanByPriceId } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Get request body and signature
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      console.error('Missing stripe-signature header');
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    // Validate webhook signature and construct event
    const event = validateWebhookSignature(body, signature);

    console.log(`Processing Stripe webhook: ${event.type}`);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook processing failed:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 400 }
    );
  }
}

/**
 * Handle successful checkout completion
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.client_reference_id;
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  if (!userId) {
    console.error('No user ID in checkout session');
    return;
  }

  try {
    // Update user with Stripe customer ID
    await prisma.user.update({
      where: { id: userId },
      data: {
        stripeCustomerId: customerId,
        subscriptionStatus: 'trialing',
        subscriptionId: subscriptionId,
        updatedAt: new Date(),
      },
    });

    console.log(`Checkout completed for user ${userId}`);
  } catch (error) {
    console.error('Failed to update user after checkout:', error);
  }
}

/**
 * Handle subscription creation
 */
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const priceId = subscription.items.data[0]?.price.id;

  if (!priceId) {
    console.error('No price ID found in subscription');
    return;
  }

  const plan = getPlanByPriceId(priceId);
  if (!plan) {
    console.error(`Unknown price ID: ${priceId}`);
    return;
  }

  try {
    // Find user by customer ID and update subscription
    const user = await prisma.user.findFirst({
      where: { stripeCustomerId: customerId },
    });

    if (!user) {
      console.error(`No user found for customer ${customerId}`);
      return;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionId: subscription.id,
        subscriptionStatus: subscription.status,
        currentPlan: plan.id,
        subscriptionCurrentPeriodStart: new Date(subscription.current_period_start * 1000),
        subscriptionCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
        updatedAt: new Date(),
      },
    });

    console.log(`Subscription created for user ${user.id}: ${plan.id}`);
  } catch (error) {
    console.error('Failed to handle subscription creation:', error);
  }
}

/**
 * Handle subscription updates
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const priceId = subscription.items.data[0]?.price.id;

  if (!priceId) {
    console.error('No price ID found in subscription');
    return;
  }

  const plan = getPlanByPriceId(priceId);

  try {
    // Find user by customer ID and update subscription
    const user = await prisma.user.findFirst({
      where: { stripeCustomerId: customerId },
    });

    if (!user) {
      console.error(`No user found for customer ${customerId}`);
      return;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionStatus: subscription.status,
        currentPlan: plan?.id || user.currentPlan,
        subscriptionCurrentPeriodStart: new Date(subscription.current_period_start * 1000),
        subscriptionCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
        updatedAt: new Date(),
      },
    });

    console.log(`Subscription updated for user ${user.id}: ${subscription.status}`);
  } catch (error) {
    console.error('Failed to handle subscription update:', error);
  }
}

/**
 * Handle subscription deletion/cancellation
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  try {
    // Find user by customer ID and update subscription status
    const user = await prisma.user.findFirst({
      where: { stripeCustomerId: customerId },
    });

    if (!user) {
      console.error(`No user found for customer ${customerId}`);
      return;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionStatus: 'canceled',
        currentPlan: null,
        subscriptionCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
        updatedAt: new Date(),
      },
    });

    // Note: Keep data until end of billing period
    console.log(`Subscription canceled for user ${user.id}`);
  } catch (error) {
    console.error('Failed to handle subscription deletion:', error);
  }
}

/**
 * Handle successful payment
 */
async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  const subscriptionId = invoice.subscription as string;

  try {
    const user = await prisma.user.findFirst({
      where: { stripeCustomerId: customerId },
    });

    if (!user) {
      console.error(`No user found for customer ${customerId}`);
      return;
    }

    // Update subscription status to active
    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionStatus: 'active',
        updatedAt: new Date(),
      },
    });

    console.log(`Payment succeeded for user ${user.id}`);
  } catch (error) {
    console.error('Failed to handle payment success:', error);
  }
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;

  try {
    const user = await prisma.user.findFirst({
      where: { stripeCustomerId: customerId },
    });

    if (!user) {
      console.error(`No user found for customer ${customerId}`);
      return;
    }

    // Update subscription status
    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionStatus: 'past_due',
        updatedAt: new Date(),
      },
    });

    console.log(`Payment failed for user ${user.id}`);
  } catch (error) {
    console.error('Failed to handle payment failure:', error);
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Webhook endpoint - POST only' },
    { status: 405 }
  );
}

