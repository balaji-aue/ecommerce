import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class OrdersService {
  private stripe: Stripe;
  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET || '', { apiVersion: '2022-11-15' });
  }

  async createPaymentIntent(amount: number, currency = 'usd') {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.max(0, Math.round(amount * 100)),
      currency,
    });
    return paymentIntent;
  }
}
