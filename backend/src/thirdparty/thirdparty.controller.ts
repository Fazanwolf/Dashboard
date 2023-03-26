import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { DiscordService } from './discord.service';
import { RedditService } from './reddit.service';
import { PapiService } from './papi.service';
import { WakatimeService } from './wakatime.service';
import { PapiDto } from '../_dto/papi.dto';
import { RequestTokenDto } from '../_dto/request-token.dto';
import { WakatimeDto } from '../_dto/wakatime.dto';

@Controller('thirdparty')
@ApiTags('ThirdParty')
@ApiNotFoundResponse({ description: 'Data not found' })
@ApiUnauthorizedResponse({ description: 'Invalid credentials' })
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
export class ThirdPartyController {
  constructor(
    private readonly discordService: DiscordService,
    private readonly redditService: RedditService,
    private readonly papiService: PapiService,
    private readonly wakatimeService: WakatimeService,
  ) {}


  @Get('papi/pornstars')
  @ApiQuery({ name: 'ethnicity', required: false, type: String })
  @ApiQuery({ name: 'nationality', required: false, type: String })
  @ApiQuery({ name: 'eyes', required: false, type: String })
  @ApiQuery({ name: 'name', required: false, type: String })
  @ApiQuery({ name: 'max_rank', required: false, type: String })
  @ApiQuery({ name: 'min_rank', required: false, type: String })
  async papiPornstars(@Query() query: PapiDto) {
    const data = await this.papiService.getPornstar(query);
    return (data);
  }

  @Get('wakatime/authorize')
  @ApiOperation({ description: "Get the authorize url to ask permission about Wakatime API" })
  @ApiQuery({ name: 'redirect_uri', required: false, type: String })
  async wakatimeAuthorize(@Query() query) {
    const url = this.wakatimeService.getAuthorize(query.redirect_uri);
    return (url);
  }

  @Get('wakatime/token')
  @ApiOperation({ description: "Retrieve a valid token for the user" })
  @ApiQuery({ name: 'redirect_uri', required: false, type: String })
  @ApiQuery({ name: 'code', required: true, type: String })
  @ApiQuery({ name: 'state', required: false, type: String })
  async wakatimeToken(@Query() query: RequestTokenDto) {
    if (query.redirect_uri) {
      return await this.wakatimeService.getToken(query, query.redirect_uri);
    }
    return await this.wakatimeService.getToken(query);
  }

  @Get('wakatime/login/callback')
  @ApiQuery({ name: 'code', required: true, type: String })
  @ApiQuery({ name: 'state', required: false, type: String })
  async wakatimeLoginCallback(@Query() query, @Res() res) {
    if (query.code) {
      const data: WakatimeDto = await this.wakatimeService.getToken(query, "http://172.20.0.7:8080/thirdparty/wakatime/login/callback");
      return res.redirect(`/auth/o2/login?token=${data.access_token}&platform=wakatime`);
    }
    return {
      message: "Code not found"
    }
  }

  @Get('wakatime/register/callback')
  @ApiQuery({ name: 'code', required: true, type: String })
  @ApiQuery({ name: 'state', required: false, type: String })
  async wakatimeRegisterCallback(@Query() query, @Res() res) {
    if (query.code) {
      const data = await this.wakatimeService.getToken(query, "http://172.20.0.7:8080/thirdparty/wakatime/register/callback");
      return res.redirect(`/auth/o2/register?token=${data.access_token}&platform=wakatime`);
    }
    return {
      message: "Code not found"
    }
  }

  @Get('wakatime/refresh/callback')
  @ApiQuery({ name: 'code', required: true, type: String })
  @ApiQuery({ name: 'state', required: false, type: String })
  async wakatimeRefreshCallback(@Query() query, @Res() res) {
    if (query.code/* && query.state*/) {
      const data = await this.wakatimeService.getToken(query, "http://172.20.0.7:8080/thirdparty/wakatime/refresh/callback");
      const user = await this.wakatimeService.getUser(data.access_token);
      return res.redirect(`/me/refresh?token=${data.access_token}&email=${user.email}&platform=wakatime`);
    }
    return {
      message: "Code not found"
    }
  }

  @Get('wakatime/user')
  @ApiOperation({ description: "Get the wakatime user profile"})
  @ApiQuery({ name: 'token', required: true, type: String })
  async wakatimeGetUserProfile(@Query() query) {
    return await this.wakatimeService.getUser(query.token);
  }

  @Get('wakatime/time/:token')
  async wakatimeCodeUntilToday(@Param('token') token: string) {
    return await this.wakatimeService.getCodeTimeUntilToday(token);
  }

  @Get('reddit/authorize')
  @ApiQuery({ name:'redirect_uri', required: false })
  async redditAuthorize(@Query() query) {
    return this.redditService.getAuthorize(query.redirect_uri);
  }

  @Get('reddit/refresh/callback')
  @ApiQuery({ name: 'code', required: true, type: String })
  @ApiQuery({ name: 'state', required: false, type: String })
  async redditRefreshCallback(@Query() query, @Res() res) {
    if (query.code && query.state) {
      const data = await this.redditService.getToken(query);
      const user = await this.redditService.getUser(data.access_token);
      return res.redirect(`/me/refresh?token=${data.access_token}&username=${user.name}&platform=reddit`);
    }
    return {
      message: "Code not found"
    }
  }

  @Get('reddit/token')
  @ApiQuery({ name: 'redirect_uri', required: false, type: String })
  @ApiQuery({ name: 'code', required: true, type: String })
  @ApiQuery({ name: 'state', required: false, type: String })
  async redditToken(@Query() query: RequestTokenDto, @Res() res) {
    let token;
    if (query.redirect_uri) token = await this.redditService.getToken(query, query.redirect_uri);
    else token = await this.redditService.getToken(query);
    return (token);
  }

  @Get('reddit/user')
  @ApiQuery({ name: 'token', required: true, type: String })
  async redditUserProfile(@Query() query) {
    return await this.redditService.getUser(query.token);
  }

  @Get('reddit/user/prefs')
  @ApiQuery({ name: 'token', required: true, type: String })
  async redditUserPrefs(@Query() query) {
    return await this.redditService.getUserPref(query.token);
  }

  @Get('reddit/lastPost/:token')
  @ApiQuery({ name: 'token', required: true, type: String })
  @ApiQuery({ name: 'name', required: true, type: String })
  async redditGetLastPost(@Query() query: { token: string, name: string }) {
    return await this.redditService.getLastPost(query.token, query.name);
  }

  @Get('discord/authorize')
  @ApiQuery({ name: 'redirect_uri', required: false, type: String })
  async discordAuthorize(@Query() query) {
    return this.discordService.getAuthorize(query.redirect_uri);
  }


  @Get('discord/token')
  @ApiQuery({ name: 'redirect_uri', required: false, type: String })
  @ApiQuery({ name: 'code', required: true, type: String })
  @ApiQuery({ name: 'state', required: false, type: String })
  async discordToken(@Query() query: RequestTokenDto, @Res() res) {
    let token;
    if (query.redirect_uri) token = await this.discordService.getToken(query, query.redirect_uri);
    else token = await this.discordService.getToken(query);
    return token;
  }

  @Get('discord/login/callback')
  @ApiQuery({ name: 'code', required: true, type: String })
  @ApiQuery({ name: 'state', required: false, type: String })
  async discordLoginCallback(@Query() query, @Res() res) {
    let state = ""
    if (query.code) {
      const data = await this.discordService.getToken(query, "http://172.20.0.7:8080/thirdparty/discord/login/callback");
      return res.redirect(`/auth/o2/login?token=${data.access_token}&platform=discord`);
    }
    return {
      message: "Code not found"
    }
  }

  @Get('discord/register/callback')
  @ApiQuery({ name: 'code', required: true, type: String })
  @ApiQuery({ name: 'state', required: false, type: String })
  async discordRegisterCallback(@Query() query, @Res() res) {
    if (query.code) {
      const data = await this.discordService.getToken(query, "http://172.20.0.7:8080/thirdparty/discord/register/callback");
      return res.redirect(`/auth/o2/register?token=${data.access_token}&platform=discord`);
    }
    return {
      message: "Code not found"
    }
  }

  @Get('discord/refresh/callback')
  @ApiQuery({ name: 'code', required: true, type: String })
  @ApiQuery({ name: 'state', required: false, type: String })
  async discordRefreshCallback(@Query() query, @Res() res) {
    let state = ""
    if (query.code) {
      if (query.state)
        state = "&state=" + query.state
      const data = await this.discordService.getToken(query, "http://172.20.0.7:8080/thirdparty/discord/refresh/callback");
      const user = await this.discordService.getUser(data.access_token);
      return res.redirect(`/me/refresh?token=${data.access_token}&email=${user.email}&platform=discord`);
    }
    return {
      message: "Code not found"
    }
  }

  @Get('discord/user')
  @ApiQuery({ name: 'token', required: true, type: String })
  async discordUser(@Query() query) {
    const user = await this.discordService.getUser(query.token);
    return user;
  }

  @Get('discord/guilds/:token')
  async discordListGuild(@Param('token') token: string) {
    const guilds = await this.discordService.getGuilds(token);
    console.log(guilds.length);
    return guilds;
  }

}