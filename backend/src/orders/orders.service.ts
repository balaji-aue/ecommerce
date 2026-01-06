import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './order.schema';

@Injectable()
export class OrdersService {
  private stripe: Stripe;
  constructor(@InjectModel(Order.name) private orderModel: Model<OrderDocument>) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET || '', { apiVersion: '2022-11-15' });
  }

  async createPaymentIntent(amount: number, currency = 'usd') {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.max(0, Math.round(amount * 100)),
      currency,
    });
    return paymentIntent;
  }

  async createOrder(userId: string, payload: { items: any[]; address: any; total: number; paymentMethod?: string }) {
    const doc = new this.orderModel({ user: userId, items: payload.items || [], address: payload.address || {}, total: payload.total || 0, paymentMethod: payload.paymentMethod || 'unknown' });
    return doc.save();
  }

  async findByUser(userId: string) {
    return this.orderModel.find({ user: userId }).sort({ createdAt: -1 }).exec();
  }
}
