import { HydratedDocument, Types, now } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {RoleEnum} from "../_enums/Role.enum";

export type UserDocument = HydratedDocument<Service>;

@Schema(
  { timestamps: { createdAt: 'created', updatedAt: 'updated' }
  })
export class Service
{
  @Prop({ required: true, default: () => new Types.ObjectId() })
  _id: string;

}

export const ServiceSchema = SchemaFactory.createForClass(Service);