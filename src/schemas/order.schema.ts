import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from './user.schema';

export type OrderDocument = Order & Document;

@Schema()
export class Order {
  @Prop({ required: true })
  restaurant: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  customer: User;

  @Prop({ required: true })
  deadline: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  customers: User[];

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  link: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
