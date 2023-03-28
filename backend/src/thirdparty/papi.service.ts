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
    return buildURL;
  }

  async getPornstar(opt?: {dto?: PapiDto, i?: number}) {
    const header: AxiosHeaders = AxiosHeaders.concat({ 'x-rapidapi-key': papi.secret, 'x-rapidapi-host': papi.host });

    let builedURL = this.buildURL(opt.dto);

    try {
      const data =  (await lastValueFrom(
        this.httpService
          .get(builedURL, { headers: header })
          .pipe(map((response) => response.data)),
      )) as any;
      // console.log(data);
      let newData = [];
      for (let act of data.results) {
        newData.push({
          name: act.name,
          age: act.age ?? 0,
          nationality: act.nationality  ?? "null",
          ethnicity: act.ethnicity ?? "null",
          cup_size: act.cup_size ?? "null",
          tats: act.tats ?? "null",
          rank: act.rank ?? 0,
          link: act.pornpics_link ?? "null",
        })
        if (opt.i == 0) break;
        if (opt.i > 0) opt.i--;
      }
      console.log(newData);
      return newData;
    } catch (e) {
      console.log(e);
    }
  }

  async getXPornstar(dto?: PapiDto, i?) {
    const header: AxiosHeaders = AxiosHeaders.concat({ 'x-rapidapi-key': papi.secret, 'x-rapidapi-host': papi.host });

    let builedURL = this.buildURL(dto);

    if (i) i = parseInt(i);
    try {
      const data = (await lastValueFrom(
        this.httpService
          .get(builedURL, { headers: header })
          .pipe(map((response) => response.data)),
      )) as any;
    } catch (e) {
      console.log(e);
    }
  }


}