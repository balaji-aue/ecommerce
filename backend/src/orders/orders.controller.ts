import { Body, Controller, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly service: OrdersService) {}

  @Post('create-payment-intent')
  async createPayment(@Body() body: { amount: number }) {
    const pi = await this.service.createPaymentIntent(body.amount);
    return { clientSecret: pi.client_secret };
  }
}
