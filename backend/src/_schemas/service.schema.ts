import { HydratedDocument, Types, now } from "mongoose";
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';

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

}

export const ServiceSchema = SchemaFactory.createForClass(Service);