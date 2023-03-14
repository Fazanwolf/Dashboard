import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { DiscordService } from '../thirdparty/discord.service';
import { discord } from '../_tools/Config';
import { ApiQuery } from '@nestjs/swagger';
import { DiscordDto } from '../_dto/discord.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly discordService: DiscordService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }


  // YOUTUBE TEST

  @Get('test/youtube/getAuthorize')
  async testAuthorize() {
    const url = await this.discordService.getAuthorize();
    console.log(url);
    return (url);
  }

  @Get('test/youtube/getToken')
  @ApiQuery({ name: 'code', required: true, type: String })
  @ApiQuery({ name: 'state', required: false, type: String })
  async testToken(@Query() query: DiscordDto) {
    const token = await this.discordService.getToken(query);
    console.log(token);
    return (token);
  }

  @Get('test/youtube/user')
  @ApiQuery({ name: 'token', required: true, type: String })
  @ApiQuery({ name: 'id', required: false, type: String })
  async testUser(@Query() query: { token: string, id?: string }) {
    if (!query.id) {
      const user = await this.discordService.getUser(query.token);
      console.log(user);
      return user;
    }
    const user = await this.discordService.getUserByID(query.token, query.id);
    console.log(user);
    return user;
  }

  @Get('test/youtube/functionality/:token')
  async testFunctionality(@Param('token') token: string) {
    const guilds = await this.discordService.getGuilds(token);
    console.log(guilds.length);
    return guilds;
  }


  // DISCORD TEST

  // @Get('test/discord/getAuthorize')
  // async testAuthorize() {
  //   const url = await this.discordService.getAuthorize();
  //   console.log(url);
  //   return (url);
  // }
  //
  // @Get('test/discord/getToken')
  // @ApiQuery({ name: 'code', required: true, type: String })
  // @ApiQuery({ name: 'state', required: false, type: String })
  // async testToken(@Query() query: DiscordDto) {
  //   const token = await this.discordService.getToken(query);
  //   console.log(token);
  //   return (token);
  // }
  //
  // @Get('test/discord/user')
  // @ApiQuery({ name: 'token', required: true, type: String })
  // @ApiQuery({ name: 'id', required: false, type: String })
  // async testUser(@Query() query: { token: string, id?: string }) {
  //   if (!query.id) {
  //     const user = await this.discordService.getUser(query.token);
  //     console.log(user);
  //     return user;
  //   }
  //   const user = await this.discordService.getUserByID(query.token, query.id);
  //   console.log(user);
  //   return user;
  // }
  //
  // @Get('test/discord/functionality/:token')
  // async testFunctionality(@Param('token') token: string) {
  //   const guilds = await this.discordService.getGuilds(token);
  //   console.log(guilds.length);
  //   return guilds;
  // }
}
