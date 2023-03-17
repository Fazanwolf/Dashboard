import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { TokensService } from './tokens.service';
import { RoleEnum } from '../_enums/Role.enum';
import { Roles } from '../_decorators/role.decorator';
import { JwtAuthGuard } from '../_guards/jwt.guard';
import { RolesGuard } from '../_guards/role.guard';
import { TokenUpdateDto } from '../_dto/token-update.dto';
import { TokenCreateDto } from '../_dto/token-create.dto';

@Controller('tokens')
@ApiTags('Tokens')
// @ApiBearerAuth()
@ApiNotFoundResponse({ description: 'User not found' })
@ApiUnauthorizedResponse({ description: 'Invalid credentials' })
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve tokens of an user' })
  @ApiOkResponse({ description: 'Token successfully found' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async getTokenOf(@Param('id') id: string) {
    return await this.tokensService.getTokenOf(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tokens' })
  @ApiOkResponse({ description: 'Token successfully found' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async getTokens() {
    return await this.tokensService.getTokens();
  }

  // @Post()
  // @ApiOperation({ summary: 'Create tokens for an user' })
  // @ApiOkResponse({ description: 'Token successfully created' })
  // // @UseGuards(JwtAuthGuard, RolesGuard)
  // // @Roles(RoleEnum.ADMIN)
  // async createToken(@Body() body: TokenCreateDto) {
  //   return await this.tokensService.createToken(body);
  // }
  //
  // @Delete(':id')
  // @ApiOperation({ summary: 'Delete token for an user' })
  // @ApiOkResponse({ description: 'Token successfully destroy' })
  // // @UseGuards(JwtAuthGuard, RolesGuard)
  // // @Roles(RoleEnum.ADMIN)
  // async deleteTokenOf(@Param(":id") id: string) {
  //   return await this.tokensService.deleteTokenOf(id);
  // }

  @Patch(':id')
  @ApiOperation({ summary: 'Update tokens of an user' })
  @ApiOkResponse({ description: 'Token successfully updated' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async updateTokenOf(@Param('id') id: string, @Body() body: TokenUpdateDto) {
    return await this.tokensService.updateTokenOf(id, body);
  }

}