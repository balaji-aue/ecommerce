import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CartDocument = Cart & Document;

@Schema()
export class Cart {
  @Prop({ type: String, required: true })
  user: string;

  @Prop([{
    product: { type: Types.ObjectId, ref: 'Product' },
    qty: { type: Number }
  }])
  items: Array<{ product: Types.ObjectId; qty: number }>;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
CartSchema.index({ user: 1 }, { unique: true });
