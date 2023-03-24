import mongoose, { HydratedDocument, Types, now } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {RoleEnum} from "../_enums/Role.enum";

export type UserDocument = HydratedDocument<User>;

@Schema(
  { timestamps: { createdAt: 'created', updatedAt: 'updated' }
})
export class User
{
  @Prop({ required: true, default: () => new Types.ObjectId() })
  _id: string;

  @Prop({ required: true })
  username: string;
  @Prop({ required: true })
  email: string;
  @Prop({ required: true })
  password: string;
  @Prop({ required: true, default: false })
  verified: boolean;

  @Prop({ enum: RoleEnum, required: true, default: RoleEnum.USER })
  role: string;

  @Prop({ required: true, Type: Boolean, default: false })
  adultContent: boolean;

  @Prop({ Type: Types.ObjectId, required: true })
  personalKey: string;

  @Prop({ Type: Number, required: true, default: 1000 * 5 })
  rateLimit: number;
}

export const UserSchema = SchemaFactory.createForClass(User);