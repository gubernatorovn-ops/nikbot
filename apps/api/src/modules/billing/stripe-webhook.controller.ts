import { Controller, Post, Req, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BillingService } from './billing.service';
import Stripe from 'stripe';

@ApiTags('Webhooks')
@Controller('webhooks')
export class StripeWebhookController {
  private stripe: Stripe;

  constructor(private billingService: BillingService) {
    if (process.env.STRIPE_SECRET_KEY) {
      this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2024-04-10',
      });
    }
  }

  @Post('stripe')
  @ApiOperation({ summary: 'Stripe webhook' })
  async handleWebhook(@Req() req: any, @Headers('stripe-signature') signature: string) {
    if (!this.stripe) {
      return { received: false, error: 'Stripe not configured' };
    }

    const event = this.stripe.webhooks.constructEvent(
      req.rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );

    await this.billingService.handleWebhook(event);

    return { received: true };
  }
}
