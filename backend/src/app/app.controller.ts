import { Controller, Get, Ip, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { ServicesService } from '../services/services.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly servicesService: ServicesService
  ) {}

  @Get()
  getHello(@Res() res): string {
    return res.redirect('/api/user');
  }

  @Get('about')
  async about(@Ip() ipValue) {
    const regexIp = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;
    const ip: string = ipValue.match(regexIp);
    const date: number = Date.now();
    const services = await this.servicesService.getServicesAbout();

    const res = {
      client: {
        host: ip,
      },
      server: {
        current_time: date,
        services: services
      }
    }
    return res;
  }
}
