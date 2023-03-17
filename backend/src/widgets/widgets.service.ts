import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Widget, WidgetDocument } from '../_schemas/widget.schema';
import { WidgetUpdateDto } from '../_dto/widget-update.dto';
import { WidgetCreateDto } from '../_dto/widget-create.dto';

@Injectable()
export class WidgetsService {
  constructor(
    @InjectModel(Widget.name) private widgetModel: Model<WidgetDocument>,
  ) {}

  async create(widgetDto: WidgetCreateDto) {
    const widget = new this.widgetModel(widgetDto);
    return widget.save();
  }

  async delete(id: string) {
    const user = await this.getWidget(id);
    if (!user) throw new NotFoundException("Service not found.");
    return await this.widgetModel.findByIdAndDelete(id).exec();
  }

  async getWidgets() {
    return await this.widgetModel.find().exec();
  }

  async getWidget(id: string) {
    const widget = await this.widgetModel.findById(id).exec();
    if (!widget) throw new NotFoundException("Widget not found.");
    return widget;
  }

  async getWidgetsOf(id: string) {
    const widget = await this.widgetModel.find({ user: id }).exec();
    if (!widget) throw new NotFoundException("That user does not have any widget.");
    return widget;
  }

  async deleteWidgetsOf(id: string) {
    const widgets = await this.widgetModel.find({ user: id }).exec();
    if (!widgets) throw new NotFoundException("That user does not have any widget.");
    for (const widget of widgets) {
      await this.widgetModel.findByIdAndDelete(widget._id).exec();
    }
    return widgets;
  }

  async update(id: string, widgetDto: WidgetUpdateDto) {
    const widget = await this.getWidget(id);
    if (!widget) throw new NotFoundException("Widget not found.");
    return await this.widgetModel.findByIdAndUpdate(id, widgetDto).exec();
  }

}