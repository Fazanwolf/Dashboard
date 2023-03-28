import { Injectable } from '@nestjs/common';
import { WidgetsService } from '../widgets/widgets.service';
import { ServicesService } from '../services/services.service';
import { TokensService } from '../tokens/tokens.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { MeProfileUpdateDto } from '../_dto/me-profile-update.dto';
import { MeWidgetUpdateDto } from '../_dto/me-widget-update.dto';
import { WidgetCreateDto } from '../_dto/widget-create.dto';
import { TokenUpdateDto } from '../_dto/token-update.dto';
import { DiscordService } from '../thirdparty/discord.service';
import { RedditService } from '../thirdparty/reddit.service';
import { PapiService } from '../thirdparty/papi.service';
import { WakatimeService } from '../thirdparty/wakatime.service';
import { Cron, Interval, SchedulerRegistry } from '@nestjs/schedule';
import { User } from '../_schemas/user.schema';
import { Token } from '../_schemas/token.schema';
import { CronJob } from 'cron';
import { Widget } from '../_schemas/widget.schema';
import { cache } from '../_tools/Config';
import { PapiDto } from '../_dto/papi.dto';

@Injectable()
export class MeService {
  constructor(
    private usersService: UsersService,
    private tokensService: TokensService,
    private servicesService: ServicesService,
    private widgetsService: WidgetsService,
    private jwtService: JwtService,
    private readonly discordService: DiscordService,
    private readonly redditService: RedditService,
    private readonly papiService: PapiService,
    private readonly wakatimeService: WakatimeService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  async getMe(head) {
    const { id } = this.jwtService.decode(head) as { id };
    const { email, username, rateLimit, adultContent } = await this.usersService.getOne(id);

    const user = {
      email,
      username,
      rateLimit,
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

  async refreshTokens(query) {
    const { email, token, platform, username } = query;

    let data;

    if (email)
      data = await this.usersService.getOneByEmail(email);
    if (username) {
      data = await this.usersService.getOneByUsername(username);
      if (!data) {
        data = await this.usersService.getOneByUsername(username.toLowerCase());
        if (!data) {
          data = await this.usersService.getOneByUsername(username.toUpperCase());
        }
      }
    }

    if (!data) return { message: "User not found" };

    let dto: TokenUpdateDto = {};

    if (platform === 'wakatime') dto.wakatime = token;
    if (platform === 'reddit') dto.reddit = token;
    if (platform === 'discord') dto.discord = token;
    await this.tokensService.updateTokenOf(data._id, dto);
    return { message: "Token refreshed" };
  }

  async checkTokens(query: { id: string, platform?: string}) {
    const { id, platform } = query;

    const tokens = await this.tokensService.getTokenOf(id);
    let reddit = false;
    let discord = false;
    let wakatime = false;

    if (!platform) {
      if (tokens.reddit === undefined || tokens.reddit == "empty")
        return this.redditService.getAuthorize("http://172.20.0.7:8080/thirdparty/reddit/refresh/callback");
      if (tokens.discord === undefined || tokens.discord == "empty")
        return this.discordService.getAuthorize("http://172.20.0.7:8080/thirdparty/discord/refresh/callback");
      if (tokens.wakatime === undefined || tokens.wakatime == "empty")
        return this.wakatimeService.getAuthorize("http://172.20.0.7:8080/thirdparty/wakatime/refresh/callback");
      try {
        reddit = await this.redditService.getUser(tokens.reddit);
        discord = await this.discordService.getUser(tokens.discord);
        wakatime = await this.wakatimeService.getUser(tokens.wakatime);
      } catch (e) {
        if (!reddit) return this.redditService.getAuthorize("http://172.20.0.7:8080/thirdparty/reddit/refresh/callback");
        if (!discord) return this.discordService.getAuthorize("http://172.20.0.7:8080/thirdparty/discord/refresh/callback");
        if (!wakatime) return this.wakatimeService.getAuthorize("http://172.20.0.7:8080/thirdparty/wakatime/refresh/callback");
      }
    }
    try {
      if (platform == "reddit") {
        if (tokens.reddit === undefined || tokens.reddit == "empty")
          return this.redditService.getAuthorize("http://172.20.0.7:8080/thirdparty/reddit/refresh/callback");
        reddit = await this.redditService.getUser(tokens.reddit);
      }
      if (platform == "discord") {
        if (tokens.discord === undefined || tokens.discord == "empty")
          return this.discordService.getAuthorize("http://172.20.0.7:8080/thirdparty/discord/refresh/callback");
        discord = await this.discordService.getUser(tokens.discord);
      }
      if (platform == "wakatime") {
        if (tokens.wakatime === undefined || tokens.wakatime == "empty")
          return this.wakatimeService.getAuthorize("http://172.20.0.7:8080/thirdparty/wakatime/refresh/callback");
        wakatime = await this.wakatimeService.getUser(tokens.wakatime);
      }
    } catch (e) {
      if (!wakatime) return this.wakatimeService.getAuthorize("http://172.20.0.7:8080/thirdparty/wakatime/refresh/callback");
      if (!reddit) return this.redditService.getAuthorize("http://172.20.0.7:8080/thirdparty/reddit/refresh/callback");
      if (!discord) return this.discordService.getAuthorize("http://172.20.0.7:8080/thirdparty/discord/refresh/callback");
    }
    return "Nothing to refresh";
  }

  async getNumberOfWidgets(head) {
    return (await this.getMyWidgets(head)).length;
  }

  async savePositions(widgets) {
    try {
      for (const widget of widgets) {
        await this.widgetsService.update(widget.id, { idx: widget.idx });
      }
      return { message: 'Positions successfully updated' };
    } catch (e) {
      console.log(e);
    }
  }

  async getMyServices(head) {
    const { id } = this.jwtService.decode(head) as { id };
    const user = await this.usersService.getOne(id);

    let servicesOrigin;
    if (user.adultContent) servicesOrigin = await this.servicesService.getServices();
    else servicesOrigin = await this.servicesService.getServicesWithoutAdultContent();

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




  async manageEveryWidgets(user: User, tokens: Token, widgets: Widget[]) {
    console.log("manageEveryWidgets of " + user.username + " (" + user._id + ")");

    try {
      for (const widget of widgets) {
        if (widget.icon == "reddit") {
          console.log("Reddit:");
          this.redditService.getLastPost(tokens.reddit, user.username).then((res) => {
            console.log(JSON.stringify(res));
            this.widgetsService.update(widget._id, { result: JSON.stringify(res) }).catch((e) => {
              console.log(e);
            });
          });
        }
        if (widget.icon == "discord") {
          let numberOfGuilds: string;
          if (widget.params[0].value) numberOfGuilds = widget.params[0].value.toString();
          this.discordService.getGuildsSimplify(tokens.discord, numberOfGuilds).then((res) => {
            this.widgetsService.update(widget._id, { result: JSON.stringify(res) }).catch((e) => {
              console.log(e);
            });
          });
        }
        if (widget.icon == "wakatime") {
          console.log("Wakatime:");
          this.wakatimeService.getCodeTimeUntilTodayBeautify(tokens.wakatime).then((res) => {
            this.widgetsService.update(widget._id, { result: JSON.stringify(res) }).catch((e) => {
              console.log(e);
            });
          });
        }
        if (widget.icon == "papi") {
          const numberOfActress = widget.params[0].value.toString();
          if (numberOfActress && numberOfActress != "Number") {
            this.papiService.getPornstar({i: parseInt(numberOfActress)}).then((res) => {
              this.widgetsService.update(widget._id, { result: JSON.stringify(res) }).catch((e) => {
                console.log(e);
              });
            });
          } else {
            this.papiService.getPornstar().then((res) => {
              this.widgetsService.update(widget._id, { result: JSON.stringify(res) }).catch((e) => {
                console.log(e);
              });
            });
          }
        }
      }
    } catch (e) {
      console.log(e);
    }

  }

  @Interval(1000 * 60)
  async manageEveryUsers() {
    console.log("managing every users");

    this.usersService.getAll().then((users: User[]) => {
      for (const user of users) {
        try {
          if (this.schedulerRegistry.getInterval(user._id) != undefined) {
            clearInterval(this.schedulerRegistry.getInterval(user._id));
            this.schedulerRegistry.deleteInterval(user._id);
          }
        } catch (e) {
          console.log(e);
        }
        this.tokensService.getTokenOf(user._id).then((tokens: Token) => {
          this.widgetsService.retreiveAllEnabledOf(user._id).then((widgets: Widget[]) => {
            let callback = async () => {
              await this.manageEveryWidgets(user, tokens, widgets);
            };
            const interval = setInterval(callback, user.rateLimit);
            this.schedulerRegistry.addInterval(user._id, interval);
          }).catch((e) => {
            console.log(e);
          });
        }).catch((e) => {
          console.log(e);
        })
      }
    }).catch((e) => {
      console.log(e);
    });

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