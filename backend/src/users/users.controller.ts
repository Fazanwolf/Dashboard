import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete, CacheKey, CacheInterceptor, UseInterceptors, CacheTTL, UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service'
import {
  ApiBearerAuth, ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse, ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import {User} from "../_schemas/user.schema";
import {UserCreateDto} from "../_dto/user-create.dto";
import {UserUpdateDto} from "../_dto/user-update.dto";
import { JwtAuthGuard } from '../_guards/jwt.guard';
import { RolesGuard } from '../_guards/role.guard';
import { Roles } from '../_decorators/role.decorator';
import { RoleEnum } from '../_enums/Role.enum';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
@ApiNotFoundResponse({ description: 'User not found' })
@ApiUnauthorizedResponse({ description: 'Invalid credentials' })
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({ description: 'Users found' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async getUsers() {
    return await this.usersService.getAll();
  }

  @Get(":id")
  @CacheKey("user")
  @CacheTTL(60 * 5)
  // @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: 'Get users by id' })
  @ApiOkResponse({ description: 'Users found' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async getUser(@Param('id') id: string) {
    return await this.usersService.getOne(id);
  }

  @Get("email/:email")
  @ApiOperation({ summary: 'Get users by id' })
  @ApiOkResponse({ description: 'Users found' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async getUserByEmail(@Param('email') email: string) {
    return await this.usersService.getOneByEmail(email);
  }

  @Post()
  @CacheKey("user")
  @ApiOperation({ summary: 'Create users' })
  @ApiCreatedResponse({ description: 'User created' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async createUser(@Body() createUserDto: UserCreateDto): Promise<User> {
    return await this.usersService.create(createUserDto);
  }

  @Delete(":id")
  @CacheKey("user")
  @ApiOperation({ summary: 'Delete users' })
  @ApiOkResponse({ description: 'User deleted' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async deleteUser(@Param('id') id: string) {
    return await this.usersService.delete(id);
  }

  @Patch(":id")
  @CacheKey("user")
  @CacheTTL(60 * 5)
  @ApiOperation({ summary: 'Update users' })
  @ApiOkResponse({ description: 'User updated' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UserUpdateDto) {
    return await this.usersService.update(id, updateUserDto);
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
