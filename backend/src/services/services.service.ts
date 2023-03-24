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

  async create(serviceDto: ServiceCreateDto) {
    const service = new this.serviceModel(serviceDto);
    return service.save();
  }

  async delete(id: string) {
    const user = await this.getService(id);
    if (!user) throw new NotFoundException("Service not found.");
    return await this.serviceModel.findByIdAndDelete(id).exec();
  }

  async drop() {
    const services = await this.serviceModel.find().exec();
    for (const service of services) {
      await this.serviceModel.findByIdAndDelete(service._id).exec();
    }
    return {
      message: "Services collection drop."
    }
  }

  async getServicesAbout() {
    const servicesOrigin = await this.serviceModel.find().exec();

    for (let i = 0; i < servicesOrigin.length; i++) {
      for (let j = 0; j < servicesOrigin[i].widgets.length; j++) {
        delete servicesOrigin[i].widgets[j]._id;
        delete servicesOrigin[i].widgets[j].user;
        delete servicesOrigin[i].widgets[j].icon;
        delete servicesOrigin[i].widgets[j].enabled;
      }
    }

    const servicesRes = servicesOrigin.map( ({ name, description, widgets, ...rest }) => {
        console.log(name, description, widgets);
        return {
          name: name,
          description: description,
          widgets: widgets
        };
      },
    );

    return servicesRes;
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