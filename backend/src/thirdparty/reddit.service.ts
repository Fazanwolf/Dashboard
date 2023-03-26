import { UsersService } from '../users/users.service';
import { HttpService } from '@nestjs/axios';
import { RequestTokenDto } from '../_dto/request-token.dto';
import { reddit } from '../_tools/Config';
import { lastValueFrom, map } from 'rxjs';
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { urlencoded } from 'express';

@Injectable()
export class RedditService {
  constructor(
    private readonly httpService: HttpService,
    // private tokenService: TokensService,
  ) {}

  redirectURI = "http://172.20.0.7:8080/thirdparty/reddit/refresh/callback"

  redditURL = {
    authorize: "https://www.reddit.com/api/v1/authorize",
    token: "https://www.reddit.com/api/v1/access_token",
    user: "https://oauth.reddit.com/api/v1/me",
    userPref: "https://oauth.reddit.com/api/v1/me/prefs",
    lastPost: "https://oauth.reddit.com/user"
  }

  BASIC_SCOPES: string = "identity read history save vote";

  getAuthorize(redirectURI: string = this.redirectURI) {
    const params = {
      response_type: "code",
      client_id: reddit.client,
      scope: encodeURI(this.BASIC_SCOPES),
      duration: "", // permanent
      state: "test", // test
      redirect_uri: encodeURI(redirectURI),
    }
    let buildURL = this.redditURL.authorize;
    buildURL += "?response_type=" + params.response_type;
    buildURL += "&client_id=" + params.client_id;
    buildURL += "&scope=" + params.scope;
    buildURL += "&redirect_uri=" + params.redirect_uri;
    if (params.duration) buildURL += "&duration=" + params.duration;
    if (params.state) buildURL += "&state=" + params.state;

    return buildURL;
    // const response = await this.httpService.get(`${this.redditURL.authorize}`, { params: params }).toPromise();
    // return (response.data);
  }

  async getUser(token: string) {
    const bearerHeader = {
      Authorization: `Bearer ${token}`,
      "User-Agent": "Dashboard API by u/Fazanwolf"
    };
    const res = await lastValueFrom(this.httpService.get(this.redditURL.user, { headers: bearerHeader }).pipe(
      map((response) => [response.data, response.status])
    ));
    if (res[1] !== 200) {
      throw new HttpException(res[0], res[1]);
    }
    return res[0];
  }

  async getUserPref(token: string) {
    const bearerHeader = {
      Authorization: `Bearer ${token}`,
      "User-Agent": "Dashboard API by u/Fazanwolf"
    };
    const res = await lastValueFrom(this.httpService.get(this.redditURL.userPref, { headers: bearerHeader }).pipe(
      map((response) => [response.data, response.status])
    ));
    if (res[1] !== 200) {
      throw new HttpException(res[0], res[1]);
    }
    return res[0];
  }

  async getLastPost(token: string, name: string) {
    const bearerHeader = {
      Authorization: `Bearer ${token}`,
      "User-Agent": "Dashboard API by u/Fazanwolf"
    };
    const res = await lastValueFrom(this.httpService.get(`${this.redditURL.lastPost}/${name}/submitted`, { headers: bearerHeader, params: { limit: 1} }).pipe(
      map((response) => [response.data, response.status])
    ));
    if (res[1] !== 200) {
      throw new HttpException(res[0], res[1]);
    }
    return res[0];
  }

  async getToken(dto: RequestTokenDto, redirectURI: string = this.redirectURI) {
    const formData = new FormData();
    formData.append('grant_type', 'authorization_code');
    formData.append('code', dto.code);
    formData.append('redirect_uri', redirectURI);

    const auth = btoa(reddit.client + ':' + reddit.secret);

    const header = {
      "User-Agent": "Dashboard API by u/Fazanwolf",
      Authorization: `Basic ${auth}`
    }

    return (await lastValueFrom(
      this.httpService
        .post(this.redditURL.token, formData, { headers: header })
        .pipe(map((response) =>  response.data)),
    )) as any;
  }

  async register(dto: RequestTokenDto)/*: Promise<User>*/ {
    // const { access_token } = await this.redditTokenRequest(dto);
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

    // await this.tokenService.updateToken(email, { redditToken: access_token });

    // delete users.password;
    // return users;
  }

  async login(dto: RequestTokenDto)/*: Promise<User>*/ {
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
    //   redditToken: access_token,
    // });
    // return users;
    // return await this.login({ mail: users.mail, password: id });
  }
}