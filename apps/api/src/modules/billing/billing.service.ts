import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class BillingService {
  private stripe: Stripe;

  constructor(private prisma: PrismaService) {
    if (process.env.STRIPE_SECRET_KEY) {
      this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2024-04-10',
      });
    }
  }

  async getSubscription(organizationId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { organizationId },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    return subscription;
  }

  async createCheckout(params: {
    organizationId: string;
    plan: 'PRO' | 'PREMIUM';
    successUrl: string;
    cancelUrl: string;
  }) {
    if (!this.stripe) {
      return { url: null, error: 'Stripe not configured' };
    }

    const org = await this.prisma.organization.findUnique({
      where: { id: params.organizationId },
      include: { subscription: true },
    });

    if (!org) {
      throw new NotFoundException('Organization not found');
    }

    let customerId = org.subscription?.stripeCustomerId;

    if (!customerId) {
      const customer = await this.stripe.customers.create({
        metadata: { organizationId: params.organizationId },
      });
      customerId = customer.id;

      await this.prisma.subscription.update({
        where: { organizationId: params.organizationId },
        data: { stripeCustomerId: customerId },
      });
    }

    const priceId = params.plan === 'PRO'
      ? process.env.STRIPE_PRICE_PRO
      : process.env.STRIPE_PRICE_PREMIUM;

    const session = await this.stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      metadata: { organizationId: params.organizationId, plan: params.plan },
    });

    return { url: session.url };
  }

  async createPortal(params: { organizationId: string; returnUrl: string }) {
    if (!this.stripe) {
      return { url: null, error: 'Stripe not configured' };
    }

    const subscription = await this.prisma.subscription.findUnique({
      where: { organizationId: params.organizationId },
    });

    if (!subscription?.stripeCustomerId) {
      throw new NotFoundException('No Stripe customer found');
    }

    const session = await this.stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: params.returnUrl,
    });

    return { url: session.url };
  }

  async handleWebhook(event: Stripe.Event) {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const { organizationId, plan } = session.metadata;

        const limits = {
          PRO: 1000,
          PREMIUM: -1,
        };

        await this.prisma.subscription.update({
          where: { organizationId },
          data: {
            plan: plan as any,
            status: 'ACTIVE',
            stripeSubscriptionId: session.subscription as string,
            monthlyInteractions: limits[plan] || 200,
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        });
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        await this.prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            plan: 'FREE',
            status: 'CANCELED',
            monthlyInteractions: 200,
          },
        });
        break;
      }
    }
  }
}
