import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { DiscordService } from '../thirdparty/discord.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { RequestTokenDto } from '../_dto/request-token.dto';
import { RedditService } from '../thirdparty/reddit.service';
import { PapiService } from '../thirdparty/papi.service';
import { PapiDto } from '../_dto/papi.dto';
import { WakatimeService } from '../thirdparty/wakatime.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly discordService: DiscordService,
    private readonly redditService: RedditService,
    private readonly papiService: PapiService,
    private readonly wakatimeService: WakatimeService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // PAPI TEST

  @ApiTags('Test/Papi')
  @Get('test/papi/functionality')
  @ApiQuery({ name: 'ethnicity', required: false, type: String })
  @ApiQuery({ name: 'nationality', required: false, type: String })
  @ApiQuery({ name: 'eyes', required: false, type: String })
  @ApiQuery({ name: 'name', required: false, type: String })
  @ApiQuery({ name: 'max_rank', required: false, type: String })
  @ApiQuery({ name: 'min_rank', required: false, type: String })
  async testPapiFunctionality(@Query() query: PapiDto) {
    const data = await this.papiService.getPornstar(query);
    return (data);
  }

  // Wakatime TEST

  @Get('test/wakatime/getAuthorize')
  @ApiTags('Test/Wakatime')
  async testWakatimeAuthorize() {
    const url = await this.wakatimeService.getAuthorize();
    console.log(url);
    return (url);
  }

  @Get('test/wakatime/getToken')
  @ApiTags('Test/Wakatime')
  @ApiQuery({ name: 'code', required: true, type: String })
  @ApiQuery({ name: 'state', required: false, type: String })
  async testWakatimeToken(@Query() query: RequestTokenDto) {
    const token = await this.wakatimeService.getToken(query);
    console.log(token);
    return (token);
  }

  @Get('test/wakatime/users')
  @ApiTags('Test/Wakatime')
  @ApiQuery({ name: 'token', required: true, type: String })
  @ApiQuery({ name: 'id', required: false, type: String })
  async testWakatimeUser(@Query() query: { token: string, id?: string }) {
    const user = await this.wakatimeService.getUser(query.token);
    console.log(user);
    return user;
  }

  @Get('test/wakatime/functionality/:token')
  @ApiTags('Test/Wakatime')
  async testWakatimeFunctionality(@Param('token') token: string) {
    return await this.wakatimeService.getCodeTimeUntilToday(token);
  }

  // REDDIT TEST

  @Get('test/reddit/getAuthorize')
  @ApiTags('Test/Reddit')
  async testRedditAuthorize() {
    const url = await this.redditService.getAuthorize();
    console.log(url);
    return (url);
  }

  @Get('test/reddit/getToken')
  @ApiTags('Test/Reddit')
  @ApiQuery({ name: 'code', required: true, type: String })
  @ApiQuery({ name: 'state', required: false, type: String })
  async testRedditToken(@Query() query: RequestTokenDto) {
    const token = await this.redditService.getToken(query);
    console.log(token);
    return (token);
  }

  @Get('test/reddit/users')
  @ApiTags('Test/Reddit')
  @ApiQuery({ name: 'token', required: true, type: String })
  @ApiQuery({ name: 'id', required: false, type: String })
  async testRedditUser(@Query() query: { token: string, id?: string }) {
    const user = await this.redditService.getUser(query.token);
    console.log(user);
    return user;
  }

  @Get('test/reddit/functionality/:token')
  @ApiTags('Test/Reddit')
  @ApiQuery({ name: 'token', required: true, type: String })
  @ApiQuery({ name: 'name', required: true, type: String })
  async testRedditFunctionality(@Query() query: { token: string, name: string }) {
    const data = await this.redditService.getLastPost(query.token, query.name);
    console.log(data);
    return data;
  }

  // DISCORD TEST

  @Get('test/discord/getAuthorize')
  @ApiTags('Test/Discord')
  async testDiscordAuthorize() {
    const url = await this.discordService.getAuthorize();
    console.log(url);
    return (url);
  }

  @Get('test/discord/getToken')
  @ApiTags('Test/Discord')
  @ApiQuery({ name: 'code', required: true, type: String })
  @ApiQuery({ name: 'state', required: false, type: String })
  async testDiscordToken(@Query() query: RequestTokenDto) {
    const token = await this.discordService.getToken(query);
    console.log(token);
    return (token);
  }

  @Get('test/discord/users')
  @ApiTags('Test/Discord')
  @ApiQuery({ name: 'token', required: true, type: String })
  @ApiQuery({ name: 'id', required: false, type: String })
  async testDiscordUser(@Query() query: { token: string, id?: string }) {
    if (!query.id) {
      const user = await this.discordService.getUser(query.token);
      console.log(user);
      return user;
    }
    const user = await this.discordService.getUserByID(query.token, query.id);
    console.log(user);
    return user;
  }

  @Get('test/discord/functionality/:token')
  @ApiTags('Test/Discord')
  async testDiscordFunctionality(@Param('token') token: string) {
    const guilds = await this.discordService.getGuilds(token);
    console.log(guilds.length);
    return guilds;
  }
}
