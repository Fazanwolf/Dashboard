import {
  Controller,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import {UserCreateDto} from "../_dto/user-create.dto";
import {UserUpdateDto} from "../_dto/user-update.dto";
import { RoleEnum } from '../_enums/Role.enum';
import { UsersService } from '../users/users.service';
import { ServicesService } from '../services/services.service';
import { ServiceCreateDto } from '../_dto/service-create.dto';
import redisStore from 'cache-manager-redis-store';
import { Param, Widget } from '../_schemas/widget.schema';
import mongoose, { Mongoose } from 'mongoose';
import { User } from '../_schemas/user.schema';

@Controller('admin')
@ApiTags('Admin')
@ApiNotFoundResponse({ description: 'Data not found' })
@ApiUnauthorizedResponse({ description: 'Invalid credentials' })
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
export class AdminController {
  constructor(
    private readonly usersService: UsersService,
    private readonly servicesService: ServicesService,
  ) {}


  exampleUser: User = {
    _id: "example",
    adultContent: false,
    username: "example",
    email: "example@gmail.com",
    password: "example123",
    role: RoleEnum.USER,
    verified: true,
    personalKey: "example",
    rateLimit: 1000 * 5
  };

  discordWidget: Widget = {
    _id: "example",
    user: this.exampleUser,
    name: "List server",
    description: "List a certain amount server",
    enabled: false,
    icon: "discord",
    result: "no_data",
    idx: -1,
    params: [
      {
        key: "How many?",
        value: "Number",
        required: true,
        type: 'number'
      }
    ]
  }

  redditWidget: Widget = {
    _id: "example",
    user: this.exampleUser,
    name: "Last posted post",
    description: "Show your latest post",
    enabled: false,
    icon: "reddit",
    result: "no_data",
    idx: -1,
    params: []
  }

  wakatimeWidget: Widget = {
    _id: "example",
    user: this.exampleUser,
    name: "Global code time",
    description: "Show the time you passed to code until today",
    enabled: false,
    idx: -1,
    result: "no_data",
    icon: "wakatime",
    params: []
  }

  papiWidget: Widget = {
    _id: "example",
    user: this.exampleUser,
    name: "Discover Pornstar",
    description: "List of pornstars",
    enabled: false,
    result: "no_data",
    idx: -1,
    icon: "papi",
    params: [
      {
        key: "How many?",
        value: "Number",
        required: true,
        type: 'number'
      },
      {
        key: "Ethnicity",
        value: "String",
        required: false,
        type: 'string'
      }
    ]
  }

  @Post("recreateServices")
  @ApiOperation({ summary: 'Create my admin account' })
  @ApiCreatedResponse({ description: 'Admin "Fazanwolf" created' })
  async recreateServices() {
    await this.servicesService.drop();

    const discord: ServiceCreateDto = {
      name: "Discord",
      description: "Discord is a free and secure all-in-one voice and text chat for gamers.",
      url: "https://discord.com/",
      icon: "discord",
      adultContent: false,
      widgets: [
        this.discordWidget,
      ],
    };

    const reddit: ServiceCreateDto = {
      name: "Reddit",
      description: 'Reddit is an American social news aggregation, content rating, and discussion website.',
      url: "https://www.reddit.com/",
      icon: "reddit",
      adultContent: false,
      widgets: [
        this.redditWidget
      ],
    };

    const wakatime: ServiceCreateDto = {
      name: "Wakatime",
      description: "WakaTime is a collection of open source IDE plugins for insights about your programming.",
      url: "https://wakatime.com/dashboard",
      icon: "wakatime",
      adultContent: false,
      widgets: [
        this.wakatimeWidget
      ],
    }

    const papi: ServiceCreateDto = {
      name: "PAPI - Porn API",
      description: "Huge database of pornstar",
      url: "https://www.papi.rest/",
      icon: "papi",
      adultContent: true,
      widgets: [
        this.papiWidget
      ],
    };

    await this.servicesService.create(discord);
    await this.servicesService.create(reddit);
    await this.servicesService.create(wakatime);
    await this.servicesService.create(papi);
    return {
      message: "Everything has been recreated."
    }
  }

  @Post("createAdmin")
  @ApiOperation({ summary: 'Create my admin account' })
  @ApiCreatedResponse({ description: 'Admin "Fazanwolf" created' })
  async createMyAdminAccount() {
    const dto: UserCreateDto = {
      email: "fazanwolf@gmail.com",
      password: "fw974admin",
      username: "fazanwolf",
    }
    const user = await this.usersService.create(dto);
    let updateDto: UserUpdateDto = {
      adultContent: true,
      verified: true,
      role: RoleEnum.ADMIN
    }
    return await this.usersService.update(user._id, updateDto);
  }

}
