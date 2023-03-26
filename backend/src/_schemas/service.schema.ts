import mongoose, { HydratedDocument, Types, now } from "mongoose";
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Widget } from './widget.schema';

export type ServiceDocument = HydratedDocument<Service>;

@Schema(
  { timestamps: { createdAt: 'created', updatedAt: 'updated' }
  })
export class Service
{
  @Prop({ required: true, default: () => new Types.ObjectId() })
  _id: string;

  @Prop({ required: true, default: "" })
  name: string;

  @Prop({ required: true, default: "" })
  description: string;

  @Prop({ required: true, default: "" })
  icon: string;

  @Prop({ required: true, default: "" })
  url: string;

  @Prop({ required: true, default: false })
  adultContent: boolean;

  @Prop({ required: true, type: mongoose.Types.Array })
  widgets: Widget[];

}

export const ServiceSchema = SchemaFactory.createForClass(Service);