import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { papi } from '../_tools/Config';
import { lastValueFrom, map } from 'rxjs';
import { PapiDto } from '../_dto/papi.dto';
import { AxiosHeaders, AxiosRequestConfig } from 'axios';

@Injectable()
export class PapiService {
  constructor(
    private readonly httpService: HttpService,
  ) {}

  buildURL(dto: PapiDto): string {
    let buildURL = papi.url;
    let arr = [];

    if (dto) {
      for (let dtoKey in dto) if (dto[dtoKey]) arr.push(`${dtoKey}=${dto[dtoKey]}`);
      if (arr.length != 0) buildURL += '?' + arr.pop();
      arr.forEach((item) => {
        buildURL += '&' + item;
      });
    }
    console.log(buildURL);
    return buildURL;
  }

  async getPornstar(dto: PapiDto) {
    const header: AxiosHeaders = AxiosHeaders.concat({ 'x-rapidapi-key': papi.secret, 'x-rapidapi-host': papi.host });

    let builedURL = this.buildURL(dto);

    return (await lastValueFrom(
      this.httpService
        .get(builedURL, { headers: header })
        .pipe(map((response) =>  response.data)),
    )) as any;
  }


}