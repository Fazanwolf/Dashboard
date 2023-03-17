
import mongoose, { HydratedDocument, Types, now } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { User, UserSchema } from './user.schema';
import { Type } from 'class-transformer';

export type TokenDocument = HydratedDocument<Token>;

@Schema(
  { timestamps: { createdAt: 'created', updatedAt: 'updated' }
  })
export class Token
{
  @Prop({ required: true, default: () => new Types.ObjectId() })
  _id: string;

  @Prop({ required: true, type: mongoose.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ required: true, type: String, default: () => "empty" })
  discord: string;

  @Prop({ required: true, type: String, default: () => "empty" })
  wakatime: string;

  @Prop({ required: true, type: String, default: () => "empty" })
  reddit: string;
}

export const TokenSchema = SchemaFactory.createForClass(Token);