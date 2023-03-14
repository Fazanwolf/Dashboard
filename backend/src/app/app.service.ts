import { Injectable } from '@nestjs/common';
import { Auth0Service } from '../auth0/auth0.service';
import { DiscordService } from '../thirdparty/discord.service';

@Injectable()
export class AppService {
  constructor() {}

  getHello(): string {
    return 'Hello World!';
  }
}
