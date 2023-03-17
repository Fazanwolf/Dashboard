import { HttpService } from '@nestjs/axios';
import { wakatime } from '../_tools/Config';
import { lastValueFrom, map } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { RequestTokenDto } from '../_dto/request-token.dto';

@Injectable()
export class WakatimeService {
  constructor(
    private readonly httpService: HttpService,
    // private tokenService: TokensService,
  ) {}

  wakatimeURL = {
    authorize: "https://wakatime.com/oauth/authorize",
    token: "https://wakatime.com/oauth/token",
    user: "https://wakatime.com/api/v1/users/current",
    code_until_today: "https://wakatime.com/api/v1/users/current/all_time_since_today"
  }

  redirect_uri: string = "http://localhost:8080";

  BASIC_SCOPES: string = "email read_logged_time read_stats read_orgs read_private_leaderboards";

  async getAuthorize(scopes: string = this.BASIC_SCOPES) {
    const params = {
      response_type: "code", // or token
      client_id: wakatime.client,
      scope: encodeURI(scopes),
      redirect_uri: encodeURI(this.redirect_uri),
    }
    return `${this.wakatimeURL.authorize}?response_type=${params.response_type}&client_id=${wakatime.client}&scope=${params.scope}&redirect_uri=${params.redirect_uri}`
  }

  async getUser(token: string) {
    const bearerHeader = {
      Authorization: `Bearer ${token}`,
    };
    const response = await this.httpService
      .get(`${this.wakatimeURL.user}`, { headers: bearerHeader })
      .toPromise();
    return response.data;
  }

  async getCodeTimeUntilToday(token: string) {
    const bearerHeader = {
      Authorization: `Bearer ${token}`,
    };
    const response = await this.httpService
      .get(`${this.wakatimeURL.code_until_today}`, { headers: bearerHeader })
      .toPromise();
    return response.data;
  }

  async getToken(dto: RequestTokenDto) {
    const formData = new FormData();
    formData.append('grant_type', 'authorization_code');
    formData.append('code', dto.code);
    formData.append('client_id', wakatime.client);
    formData.append('client_secret', wakatime.secret);
    formData.append('redirect_uri', this.redirect_uri);
    console.log(formData);
    return (await lastValueFrom(
      this.httpService
        .post(this.wakatimeURL.token, formData)
        .pipe(map((response) => response.data)),
    )) as any;
  }

  async oAuth2Register(dto: RequestTokenDto)/*: Promise<User>*/ {
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

  async oAuth2Login(dto: RequestTokenDto)/*: Promise<User>*/ {
    const { access_token } = await this.getToken(dto);
    const { id, email } = await this.getUser(access_token);
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