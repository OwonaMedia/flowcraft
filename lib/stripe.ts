/**
 * Stripe Configuration
 * DSGVO-konforme Payment-Integration für FlowCraft
 */

import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY environment variable is required');
}

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable is required');
}

// Server-side Stripe instance
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
  appInfo: {
    name: 'FlowCraft',
    version: '1.0.0',
    url: 'https://owona.de/flowcraft',
  },
});

// Pricing Plans Configuration
export const PRICING_PLANS = {
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 29,
    currency: 'EUR',
    interval: 'month',
    stripePriceId: process.env.STRIPE_STARTER_PRICE_ID || '',
    features: [
      '1.000 Nachrichten/Monat',
      '1 WhatsApp Nummer',
      'Grundlegende Flows',
      'E-Mail Support',
    ],
    limits: {
      messages: 1000,
      whatsappNumbers: 1,
      flows: 5,
      aiRequests: 0,
    },
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    price: 79,
    currency: 'EUR',
    interval: 'month',
    stripePriceId: process.env.STRIPE_PROFESSIONAL_PRICE_ID || '',
    features: [
      '10.000 Nachrichten/Monat',
      '3 WhatsApp Nummern',
      'Erweiterte Flows',
      'Priority Support',
      'KI-Integration',
      'Detaillierte Analytics',
    ],
    limits: {
      messages: 10000,
      whatsappNumbers: 3,
      flows: 25,
      aiRequests: 5000,
    },
    popular: true,
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 299,
    currency: 'EUR',
    interval: 'month',
    stripePriceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || '',
    features: [
      'Unbegrenzte Nachrichten',
      'Unbegrenzte Nummern',
      'Custom Integrationen',
      'Dedicated Support',
      'On-Premise Option',
      'White-Label',
    ],
    limits: {
      messages: -1, // Unlimited
      whatsappNumbers: -1,
      flows: -1,
      aiRequests: -1,
    },
  },
} as const;

export type PricingPlan = keyof typeof PRICING_PLANS;

/**
 * Create Stripe Checkout Session
 */
export async function createCheckoutSession({
  priceId,
  userId,
  userEmail,
  successUrl,
  cancelUrl,
}: {
  priceId: string;
  userId: string;
  userEmail: string;
  successUrl: string;
  cancelUrl: string;
}) {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card', 'sepa_debit'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: userEmail,
      client_reference_id: userId,
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      automatic_tax: {
        enabled: true,
      },
      tax_id_collection: {
        enabled: true,
      },
      subscription_data: {
        metadata: {
          userId,
        },
        trial_period_days: 14, // 14 Tage kostenlose Testphase
      },
      metadata: {
        userId,
        product: 'flowcraft',
      },
    });

    return session;
  } catch (error) {
    console.error('Stripe checkout session creation failed:', error);
    throw new Error('Payment session could not be created');
  }
}

/**
 * Create Stripe Customer Portal Session
 */
export async function createCustomerPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string;
  returnUrl: string;
}) {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return session;
  } catch (error) {
    console.error('Stripe customer portal session creation failed:', error);
    throw new Error('Customer portal session could not be created');
  }
}

/**
 * Get subscription details by customer ID
 */
export async function getSubscription(customerId: string) {
  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1,
    });

    return subscriptions.data[0] || null;
  } catch (error) {
    console.error('Failed to retrieve subscription:', error);
    return null;
  }
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.cancel(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Failed to cancel subscription:', error);
    throw new Error('Subscription cancellation failed');
  }
}

/**
 * Get customer by email
 */
export async function getCustomerByEmail(email: string) {
  try {
    const customers = await stripe.customers.list({
      email,
      limit: 1,
    });

    return customers.data[0] || null;
  } catch (error) {
    console.error('Failed to retrieve customer:', error);
    return null;
  }
}

/**
 * Create or update customer
 */
export async function createOrUpdateCustomer({
  email,
  name,
  userId,
}: {
  email: string;
  name?: string;
  userId: string;
}) {
  try {
    // Check if customer already exists
    const existingCustomer = await getCustomerByEmail(email);
    
    if (existingCustomer) {
      // Update existing customer
      const customer = await stripe.customers.update(existingCustomer.id, {
        name,
        metadata: {
          userId,
        },
      });
      return customer;
    } else {
      // Create new customer
      const customer = await stripe.customers.create({
        email,
        name,
        metadata: {
          userId,
        },
      });
      return customer;
    }
  } catch (error) {
    console.error('Failed to create or update customer:', error);
    throw new Error('Customer creation/update failed');
  }
}

/**
 * Get pricing plan by Stripe price ID
 */
export function getPlanByPriceId(priceId: string) {
  return Object.values(PRICING_PLANS).find(
    plan => plan.stripePriceId === priceId
  );
}

/**
 * Format price for display
 */
export function formatPrice(amount: number, currency: string = 'EUR') {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Validate webhook signature
 */
export function validateWebhookSignature(payload: string, signature: string) {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  if (!endpointSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET environment variable is required');
  }

  try {
    return stripe.webhooks.constructEvent(payload, signature, endpointSecret);
  } catch (error) {
    console.error('Webhook signature validation failed:', error);
    throw new Error('Invalid webhook signature');
  }
}

