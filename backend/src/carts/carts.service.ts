import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument } from './cart.schema';

@Injectable()
export class CartsService {
  constructor(@InjectModel(Cart.name) private cartModel: Model<CartDocument>) {}

  async getByUser(userId: string) {
    const cart = await this.cartModel.findOne({ user: userId }).populate('items.product').exec();
    if (!cart) return { user: userId, items: [] };
    return { user: cart.user, items: cart.items };
  }

  async upsertByUser(userId: string, items: Array<{ product: string; qty: number }>) {
    if (!userId) throw new BadRequestException('Invalid user id');
    const payload = { user: userId, items: items.map(i => ({ product: i.product, qty: i.qty })) };
    const cart = await this.cartModel.findOneAndUpdate({ user: userId }, payload, { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true, context: 'query' }).exec();
    return this.cartModel.findById(cart._id).populate('items.product').exec();
  }

  async clear(userId: string) {
    if (!userId) throw new BadRequestException('Invalid user id');
    const res = await this.cartModel.findOneAndUpdate({ user: userId }, { items: [] }, { new: true }).exec();
    if (!res) {
      // Create an empty one so future calls are consistent
      await this.cartModel.create({ user: userId, items: [] });
      return { user: userId, items: [] };
    }
    return { user: res.user, items: res.items };
  }
}
