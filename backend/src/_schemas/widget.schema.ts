import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.schema';

export type WidgetDocument = HydratedDocument<Widget>;

@Schema(
  { timestamps: { createdAt: 'created', updatedAt: 'updated' }
  })
export class Widget
{
  @Prop({ required: true, default: () => new Types.ObjectId() })
  _id: string;


  @Prop({ required: true, type: mongoose.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ required: true, default: "" })
  name: string;

  @Prop({ required: true, default: "" })
  description: string;

  @Prop({ required: true, default: "none" })
  icon: string;

  @Prop({ required: true, default: true })
  enabled: boolean;

  @Prop(
    raw([{
      key: { type: String },
      value: { type: String }
    }]
    )
  )
  params: Record<string, string>[]

}

export const WidgetSchema = SchemaFactory.createForClass(Widget);