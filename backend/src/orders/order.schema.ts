import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: String, required: true })
  user: string;

  @Prop([{
    product: { type: Types.ObjectId, ref: 'Product' },
    qty: { type: Number }
  }])
  items: Array<{ product: Types.ObjectId; qty: number }>;

  // Snapshot of address used for the order
  @Prop({ type: Object })
  address: any;

  @Prop({ type: Number })
  total: number;

  @Prop({ type: String, default: 'created' })
  status: string;

  @Prop()
  paymentMethod?: string; // e.g., 'stripe', 'upi'
}

export const OrderSchema = SchemaFactory.createForClass(Order);
OrderSchema.index({ user: 1 });