import { UsersService } from '../user/users.service';
import { HttpService } from '@nestjs/axios';
import { DiscordDto } from '../_dto/discord.dto';
import { discord } from '../_tools/Config';
import { lastValueFrom, map } from 'rxjs';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class YoutubeService {
  constructor(
    private readonly httpService: HttpService,
    // private tokenService: TokensService,
  ) {}

  youtubeURL = {
    authorize: "https://"
  }

  BASICSCOPES: string = "identify guilds email connections gdm.join guilds.join guilds.members.read";

  async getAuthorize(scopes: string = this.BASICSCOPES) {
    const params = {
      response_type: "code",
      client_id: discord.client,
      scope: scopes.split(' ').join('%20')
    }
    return `${this.discordURL.authorize}?response_type=${params.response_type}&client_id=${discord.client}&scope=${params.scope}`
    // const response = await this.httpService.get(`${this.discordURL.authorize}`, { params: params }).toPromise();
    // return (response.data);
  }

  async getUser(token: string) {
    const bearerHeader = {
      Authorization: `Bearer ${token}`,
    };
    const response = await this.httpService
      .get('https://discord.com/api/users/@me', { headers: bearerHeader })
      .toPromise();
    if (!response.data)
      return response;
    return response.data;
  }

  async getToken(dto: DiscordDto) {
    const formData = new FormData();
    // formData.append('grant_type', 'authorization_code');
    // formData.append('code', dto.code);
    // formData.append('client_id', discord.client);
    // formData.append('client_secret', discord.secret);
    if (dto.state) formData.append('state', dto.state);
    return (await lastValueFrom(
      this.httpService
        .post(this.discordURL.token, formData)
        .pipe(map((response) => response.data)),
    )) as any;
  }

  async register(dto: DiscordDto)/*: Promise<User>*/ {
    // const { access_token } = await this.discordTokenRequest(dto);
    // const { id, username, email } = await this.getDiscordUserInfo(access_token);

    // const userDto: CreateUserDto = {
    //   username: username,
    //   password: id,
    //   mail: email,
    // };

    // const user: User = await this.userService.create(userDto);

    // if (user === null || user === undefined)
    // throw new ForbiddenException(
    //   '/O2/Discord/REGISTER: User already existing.',
    // );

    // await this.tokenService.updateToken(email, { discordToken: access_token });

    // delete user.password;
    // return user;
  }

  async login(dto: DiscordDto)/*: Promise<User>*/ {
    const { access_token } = await this.getToken(dto);
    const { id, email } = await this.getUser(access_token);
    //
    // const userDto: LoginAuthDto = {
    //   mail: email,
    //   password: id,
    // };
    //
    // const user: User = await this.userService.findUserByMail(email);
    //
    // if (user === null || user === undefined)
    //   throw new ForbiddenException('/O2/Discord/LOGIN: USER.');
    //
    // await this.tokenService.updateToken(user.mail.toString(), {
    //   discordToken: access_token,
    // });
    // return user;
    // return await this.login({ mail: user.mail, password: id });
  }
}