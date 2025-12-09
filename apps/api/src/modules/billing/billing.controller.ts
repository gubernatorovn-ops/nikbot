import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { BillingService } from './billing.service';

@ApiTags('Billing')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('billing')
export class BillingController {
  constructor(private billingService: BillingService) {}

  @Get(':organizationId')
  @ApiOperation({ summary: 'Get subscription' })
  getSubscription(@Param('organizationId') organizationId: string) {
    return this.billingService.getSubscription(organizationId);
  }

  @Post('checkout')
  @ApiOperation({ summary: 'Create checkout session' })
  createCheckout(@Body() body: {
    organizationId: string;
    plan: 'PRO' | 'PREMIUM';
    successUrl: string;
    cancelUrl: string;
  }) {
    return this.billingService.createCheckout(body);
  }

  @Post('portal')
  @ApiOperation({ summary: 'Create billing portal session' })
  createPortal(@Body() body: { organizationId: string; returnUrl: string }) {
    return this.billingService.createPortal(body);
  }
}
