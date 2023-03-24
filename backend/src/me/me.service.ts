import { Injectable } from '@nestjs/common';
import { WidgetsService } from '../widgets/widgets.service';
import { ServicesService } from '../services/services.service';
import { TokensService } from '../tokens/tokens.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { MeProfileUpdateDto } from '../_dto/me-profile-update.dto';
import { MeWidgetUpdateDto } from '../_dto/me-widget-update.dto';
import { WidgetCreateDto } from '../_dto/widget-create.dto';

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

    return user;
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
    const servicesOrigin = await this.servicesService.getServices();

    for (let i = 0; i < servicesOrigin.length; i++) {
      for (let j = 0; j < servicesOrigin[i].widgets.length; j++) {
        delete servicesOrigin[i].widgets[j]._id;
        delete servicesOrigin[i].widgets[j].user;
      }
    }

    return servicesOrigin.map(({ name, description, widgets, icon, url, ...rest }) => {
        return {
          name: name,
          description: description,
          icon: icon,
          url: url,
          widgets: widgets
        };
      },
    );
  }

  async getMyWidgets(head) {
    const { id } = this.jwtService.decode(head) as { id };
    return await this.widgetsService.getWidgetsOf(id);
  }

  async createMyWidget(head, body: WidgetCreateDto) {
    const { id } = this.jwtService.decode(head) as { id };
    body.user = id;
    await this.widgetsService.create(body);
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