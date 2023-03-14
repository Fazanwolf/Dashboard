import { HydratedDocument, Types, now } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type UserDocument = HydratedDocument<Widget>;

@Schema()
export class Widget
{
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  inputs: string[];

}

export const WidgetSchema = SchemaFactory.createForClass(Widget);