import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Service, ServiceDocument } from '../_schemas/service.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ServiceUpdateDto } from '../_dto/service-update.dto';
import { ServiceCreateDto } from '../_dto/service-create.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectModel(Service.name) private serviceModel: Model<ServiceDocument>,
  ) {}

  async create(tokenDto: ServiceCreateDto) {
    const token = new this.serviceModel(tokenDto);
    return token.save();
  }

  async delete(id: string) {
    const user = await this.getService(id);
    if (!user) throw new NotFoundException("Service not found.");
    return await this.serviceModel.findByIdAndDelete(id).exec();
  }

  async getServices() {
    return await this.serviceModel.find().exec();
  }

  async getService(id: string) {
    const service = await this.serviceModel.findById(id).exec();
    if (!service) throw new NotFoundException("Service not found.");
    return service
  }

  async update(id: string, serviceDto: ServiceUpdateDto) {
    const service = await this.getService(id);
    if (!service) throw new NotFoundException("Service not found.");
    return await this.serviceModel.findByIdAndUpdate(id, serviceDto).exec();
  }

}