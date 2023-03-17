import { Injectable } from '@nestjs/common';
import { WidgetsService } from '../widgets/widgets.service';
import { ServicesService } from '../services/services.service';
import { TokensService } from '../tokens/tokens.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { MeProfileUpdateDto } from '../_dto/me-profile-update.dto';
import { MeWidgetUpdateDto } from '../_dto/me-widget-update.dto';

@Injectable()
export class MeService {
  constructor(
    private usersService: UsersService,
    private tokensService: TokensService,
    private servicesService: ServicesService,
    private widgetsService: WidgetsService,
    private jwtService: JwtService,
  ) {}

  async getMe(head) {
    const { id } = this.jwtService.decode(head) as { id };
    const { email, username, adultContent } = await this.usersService.getOne(id);

    const user = {
      email,
      username,
      adultContent,
    }

    return {
      message: 'User data successfully retrieved',
      data: user,
    }
  }

  async updateMe(head, body: MeProfileUpdateDto) {
    const { id } = this.jwtService.decode(head) as { id };
    await this.usersService.update(id, body);
    return { message: 'Profile successfully updated' };
  }

  async deleteMe(head) {
    const { id } = this.jwtService.decode(head) as { id };
    await this.usersService.delete(id);
    await this.widgetsService.deleteWidgetsOf(id);
    return { message: 'Profile successfully deleted' };
  }

  async getMyServices(head) {
    const { id } = this.jwtService.decode(head) as { id };
    const services = await this.servicesService.getServices();
    return {
      message: 'User services successfully retrieved',
      data: services,
    }
  }

  async getMyWidgets(head) {
    const { id } = this.jwtService.decode(head) as { id };
    const widgets = await this.widgetsService.getWidgetsOf(id);
    return {
      message: 'User widgets successfully retrieved',
      data: widgets,
    }
  }

  async createMyWidget(head, body: MeWidgetUpdateDto) {
    const { id } = this.jwtService.decode(head) as { id };
    await this.widgetsService.create(id, body);
    return { message: 'Widget successfully created' };
  }

  async updateMyWidget(head, targetId: string, body: MeWidgetUpdateDto) {
    const { id } = this.jwtService.decode(head) as { id };
    await this.widgetsService.update(targetId, body);
    return { message: 'Widget successfully updated' };
  }

  async deleteMyWidget(head, targetId: string) {
    const { id } = this.jwtService.decode(head) as { id };
    await this.widgetsService.delete(targetId);
    return { message: 'Widget successfully deleted' };
  }

}