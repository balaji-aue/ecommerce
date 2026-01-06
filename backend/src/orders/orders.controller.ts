import { Body, Controller, Post, Req, UseGuards, Get, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly service: OrdersService) {}

  @Post('create-payment-intent')
  async createPayment(@Body() body: { amount: number }) {
    const pi = await this.service.createPaymentIntent(body.amount);
    return { clientSecret: pi.client_secret };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createOrder(@Req() req: any, @Body() body: { items: any[]; address: any; total: number; paymentMethod?: string }) {
    const userId = req.user && req.user._id;
    if (!userId) throw new UnauthorizedException('Missing user id in token');
    const order = await this.service.createOrder(userId, body);
    return order;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyOrders(@Req() req: any) {
    const userId = req.user && req.user._id;
    if (!userId) throw new UnauthorizedException('Missing user id in token');
    return this.service.findByUser(userId);
  }
}
