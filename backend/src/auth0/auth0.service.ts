import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map, Observable } from 'rxjs';
import { auth0 } from '../_tools/Config';

@Injectable()
export class Auth0Service {
  private token =
    'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhcmVhIiwiaXNzIjoiYXJlYSIsIlV3VS1DaGlwbXVua3MiOiJVd1UgQ2hpcG11bmtzIC0gcmFuZG9tIGp3dCB0byBub3QgdHJpZ2dlciA0MDAgZXJyb3IgY29kZSBvbiBhdXRoMCIsImV4cCI6MTAzMjk1NDk2MCwiaWF0IjoxMDMyODY4NTYwfQ.S-R-k2atAUmhSo8WQBFf-iUx5ct9qcMjsHhbRb5m5KM';
  private token_url = `https://${auth0.domain}/oauth/token`;
  private audience = `https://${auth0.domain}/api/v2/`;
  private api_user = `https://${auth0.domain}/api/v2/users`;
  private auth0Data: any = {
    client_id: auth0.client,
    client_secret: auth0.secret,
    audience: this.audience,
    grant_type: 'client_credentials',
  };

  constructor(private readonly httpService: HttpService) {
    this.interceptor();
    this.refreshAuth0AccessToken().subscribe(
      (data) => (this.token = data.access_token),
    );
  }

  interceptor() {
    this.httpService.axiosRef.interceptors.response.use(
      (response) => {
        return response;
      },
      async (err: any) => {
        const config = err.config;
        if (
          err.response.status === 401 &&
          err.response.config.url !== this.token_url &&
          !config._retry
        ) {
          config._retry = true;
          const data = await lastValueFrom(this.refreshAuth0AccessToken());
          this.token = data.access_token;
          err.config.headers.Authorization = `Bearer ${data.access_token}`;
          return this.httpService.axiosRef(config);
        }
        return Promise.reject(err);
      },
    );
  }

  refreshAuth0AccessToken(): Observable<any> {
    return this.httpService
      .post(this.token_url, this.auth0Data)
      .pipe(map((response) => response.data));
  }

  getUser(clientId: string): Observable<any> {
    return this.httpService
      .get(`${this.api_user}/${clientId}`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      })
      .pipe(
        map((response) => {
          if (response.status === 401)
            throw new InternalServerErrorException(
              'Failed to get access token from Auth0',
            );
          return response.data;
        }),
      );
  }
}