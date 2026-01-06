import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AddressDocument = Address & Document;

@Schema({ timestamps: true })
export class Address {
  @Prop({ type: String, required: true })
  user: string;

  @Prop()
  label?: string;

  @Prop({ required: true })
  line1: string;

  @Prop()
  line2?: string;

  @Prop()
  city?: string;

  @Prop()
  state?: string;

  @Prop()
  postalCode?: string;

  @Prop()
  country?: string;

  @Prop()
  phone?: string;

  @Prop({ default: false })
  isDefault?: boolean;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
AddressSchema.index({ user: 1 });