import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 'user' })
  role: string; // 'user' | 'admin'

  // New optional user profile fields
  @Prop()
  firstName?: string;

  @Prop()
  lastName?: string;

  @Prop()
  mobile?: string;

  // kept for backwards-compatibility
  @Prop()
  name?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);