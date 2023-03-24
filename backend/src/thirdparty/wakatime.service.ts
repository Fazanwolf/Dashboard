import { HttpService } from '@nestjs/axios';
import { wakatime } from '../_tools/Config';
import { catchError, lastValueFrom, map } from 'rxjs';
import { HttpException, Injectable } from '@nestjs/common';
import { RequestTokenDto } from '../_dto/request-token.dto';
import axios, { AxiosError } from 'axios';

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

  redirect_uri: string = "http://localhost:8080/thirdparty/wakatime/callback";

  BASIC_SCOPES: string = "email read_logged_time read_stats read_orgs read_private_leaderboards";

  getAuthorize(redirectURI = this.redirect_uri) {
    const params = {
      response_type: "code", // or token
      client_id: wakatime.client,
      scope: encodeURI(this.BASIC_SCOPES),
      redirect_uri: encodeURI(redirectURI),
    }
    return `${this.wakatimeURL.authorize}?response_type=${params.response_type}&client_id=${wakatime.client}&scope=${params.scope}&redirect_uri=${params.redirect_uri}`
  }

  async getUser(token: string) {
    const bearerHeader = {
      Authorization: `Bearer ${token}`,
    };
    console.log(bearerHeader)

    try {
      const res = await lastValueFrom(this.httpService.get(`${this.wakatimeURL.user}`, { headers: bearerHeader }).pipe(
        map((response) => [response.data, response.status])
      ));
      if (res[1] !== 200) {
        throw new HttpException(res[0], res[1]);
      }
      return res[0];
    } catch (err) {
      throw new HttpException(err.response.data, err.response.status);
    }
    // const { data } = await lastValueFrom(
    //   this.httpService
    //     .get(`${this.wakatimeURL.user}`, { headers: bearerHeader })
    //     .pipe(catchError((err) => throw new HttpException(err.response.data, err.response.status)))
    // );
    // return data;
  }

  async getCodeTimeUntilToday(token: string) {
    const bearerHeader = {
      Authorization: `Bearer ${token}`,
    };

    const res = await lastValueFrom(this.httpService.get(`${this.wakatimeURL.code_until_today}`, { headers: bearerHeader }).pipe(
      map((response) => [response.data, response.status])
    ));
    if (res[1] !== 200) {
      throw new HttpException(res[0], res[1]);
    }
    return res[0];
    /*const { data } = await lastValueFrom(
      this.httpService
        .get(`${this.wakatimeURL.code_until_today}`, { headers: bearerHeader })
        .pipe(catchError((err: AxiosError) => {
          throw new HttpException(err.response.data, err.response.status);
        }))
    );*/
  }

  async getToken(dto: RequestTokenDto, redirectURI = this.redirect_uri) {
    const formData = new FormData();
    formData.append('grant_type', 'authorization_code');
    formData.append('code', dto.code);
    formData.append('client_id', wakatime.client);
    formData.append('client_secret', wakatime.secret);
    formData.append('redirect_uri', redirectURI);
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