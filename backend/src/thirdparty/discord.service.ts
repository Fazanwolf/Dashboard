import { UsersService } from '../users/users.service';
import { HttpService } from '@nestjs/axios';
import { discord } from '../_tools/Config';
import { lastValueFrom, map } from 'rxjs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { RequestTokenDto } from '../_dto/request-token.dto';
import { TokensService } from '../tokens/tokens.service';

@Injectable()
export class DiscordService {
  constructor(
    private readonly httpService: HttpService,
    private readonly tokensService: TokensService
    // private tokenService: TokensService,
  ) {}

  discordURL = {
    authorize: "https://discord.com/oauth2/authorize",
    token: "https://discord.com/api/oauth2/token",
    user: "https://discord.com/api/users/@me",
    users: "https://discord.com/api/users",
    guilds: "https://discord.com/api/users/@me/guilds",
    guild: "https://discord.com/api/guilds"
  }

  redirect_uri: string = "http://localhost:8080/thirdparty/discord/refresh/callback";

  BASIC_SCOPES: string = "identify guilds email connections gdm.join guilds.join guilds.members.read";


  async getGuilds(token: string) {
    const bearerHeader = {
      Authorization: `Bearer ${token}`,
    };
    try {
      return (await lastValueFrom(
        this.httpService
          .get(this.discordURL.guilds, {
            headers: bearerHeader,
          })
          .pipe(map((response) => response.data)),
      )) as any;
    } catch (e) {
      console.log(e);
    }
  }

  async getGuildsSimplify(token: string, i?) {
    try {
      const data = await this.getGuilds(token);
      const guilds = [];

      if (i) i = parseInt(i) - 1;

      for (const guild of data) {
        if (guild.icon) guilds.push({
          name: guild.name,
          icon: `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`,
        });
        else guilds.push({
          name: guild.name,
          icon: `https://cdn.discordapp.com/icons/1089804302819794946/a78c420626ecb22fc6f8e74be7b6edf6.png`,
        });
        if (i == 0) break;
        if (i > 0) i--;
      }
      return guilds;
    } catch (e) {
      console.log(e);
    }
  }

  async getGuildByName(token: string, options?: any) {
    const guilds = await this.getGuilds(token);
    for (const guild of guilds) {
      if (guild.name === options.name) {
        return guild;
      }
    }
    return new NotFoundException('Guild not found');
  }

  async getNumberGuilds(token: string) {
    const guilds = await this.getGuilds(token);
    return guilds.length;
  }

  getAuthorize(redirectURI = this.redirect_uri) {
    const params = {
      response_type: "code",
      client_id: discord.client,
      scope: this.BASIC_SCOPES.split(' ').join('%20'),
      redirect_uri: redirectURI
    }
    return `${this.discordURL.authorize}?response_type=${params.response_type}&client_id=${discord.client}&scope=${params.scope}&redirect_uri=${params.redirect_uri}`;
  }

  async getUser(token: string) {
    const bearerHeader = {
      Authorization: `Bearer ${token}`,
    };
    try {
      const response = await this.httpService
        .get(`${this.discordURL.user}`, { headers: bearerHeader })
        .toPromise();
      if (!response.data)
        return response;
      return response.data;
    } catch (e) {
      console.log(e);
    }
  }

  async getUserByID(token: string, id: string) {
    const bearerHeader = {
      Authorization: `Bearer ${token}`,
    };
    try {
      const response = await this.httpService
        .get(`${this.discordURL.users}/${id}`, { headers: bearerHeader })
        .toPromise();
      if (!response.data)
        return response;
      return response.data;
    } catch (e) {
      console.log(e);
    }
  }

  async getToken(dto: RequestTokenDto, redirectURI = this.redirect_uri) {
    const formData = new FormData();
    formData.append('grant_type', 'authorization_code');
    formData.append('code', dto.code);
    formData.append('client_id', discord.client);
    formData.append('client_secret', discord.secret);
    formData.append('redirect_uri', redirectURI);
    if (dto.state) formData.append('state', dto.state);
    try {
      return (await lastValueFrom(
        this.httpService
          .post(this.discordURL.token, formData)
          .pipe(map((response) => response.data)),
      )) as any;
    } catch (e) {
      console.log(e);
    }
  }

  async discordOauth2Register(dto: RequestTokenDto)/*: Promise<User>*/ {
    // const { access_token } = await this.discordTokenRequest(dto);
    // const { id, username, email } = await this.getDiscordUserInfo(access_token);

    // const userDto: CreateUserDto = {
    //   username: username,
    //   password: id,
    //   mail: email,
    // };

    // const users: User = await this.userService.create(userDto);

    // if (users === null || users === undefined)
      // throw new ForbiddenException(
      //   '/O2/Discord/REGISTER: User already existing.',
      // );

    // await this.tokenService.updateToken(email, { discordToken: access_token });

    // delete users.password;
    // return users;
  }

  async discordLogin(dto: RequestTokenDto)/*: Promise<User>*/ {
    // const { access_token } = await this.getToken(dto);
    // const { id, email } = await this.getUser(access_token);

    //
    // const userDto: LoginAuthDto = {
    //   mail: email,
    //   password: id,
    // };
    //
    // const users: User = await this.userService.findUserByMail(email);
    //
    // if (users === null || users === undefined)
    //   throw new ForbiddenException('/O2/Discord/LOGIN: USER.');
    //
    // await this.tokenService.updateToken(users.mail.toString(), {
    //   discordToken: access_token,
    // });
    // return users;
    // return await this.login({ mail: users.mail, password: id });
  }
}