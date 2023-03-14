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
@ApiBearerAuth()
@ApiNotFoundResponse({ description: 'User not found' })
@ApiUnauthorizedResponse({ description: 'Invalid credentials' })
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiTags('Users')
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({ description: 'Users found' })
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  async getUsers() {
    return await this.usersService.getAll();
  }

  @ApiTags('Users')
  @Get(":id")
  @CacheKey("user")
  @CacheTTL(60 * 5)
  // @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: 'Get user by id' })
  @ApiOkResponse({ description: 'Users found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async getUser(@Param('id') id: string) {
    return await this.usersService.getOne(id);
  }

  @ApiTags('Users')
  @Get("email/:email")
  @ApiOperation({ summary: 'Get user by id' })
  @ApiOkResponse({ description: 'Users found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async getUserByEmail(@Param('email') email: string) {
    return await this.usersService.getOneByEmail(email);
  }

  @ApiTags('Users')
  @Post()
  @CacheKey("user")
  @ApiOperation({ summary: 'Create user' })
  @ApiCreatedResponse({ description: 'User created' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async createUser(@Body() createUserDto: UserCreateDto): Promise<User> {
    return await this.usersService.create(createUserDto);
  }

  @ApiTags('Users')
  @Delete(":id")
  @CacheKey("user")
  @ApiOperation({ summary: 'Delete user' })
  @ApiOkResponse({ description: 'User deleted' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async deleteUser(@Param('id') id: string) {
    return await this.usersService.delete(id);
  }

  @ApiTags('Users')
  @Patch(":id")
  @CacheKey("user")
  @CacheTTL(60 * 5)
  @ApiOperation({ summary: 'Update user' })
  @ApiOkResponse({ description: 'User updated' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UserUpdateDto) {
    return await this.usersService.update(id, updateUserDto);
  }


}
