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
import { WidgetsService } from './widgets.service';
import { RoleEnum } from '../_enums/Role.enum';
import { Roles } from '../_decorators/role.decorator';
import { JwtAuthGuard } from '../_guards/jwt.guard';
import { RolesGuard } from '../_guards/role.guard';
import { WidgetCreateDto } from '../_dto/widget-create.dto';
import { WidgetUpdateDto } from '../_dto/widget-update.dto';

@Controller('widgets')
@ApiTags('Widgets')
@ApiBearerAuth()
@ApiNotFoundResponse({ description: 'Widget not found' })
@ApiUnauthorizedResponse({ description: 'Invalid credentials' })
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
export class WidgetsController {
  constructor(private readonly widgetsService: WidgetsService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get a widget' })
  @ApiOkResponse({ description: 'Widget successfully found' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async getWidget(@Param('id') id: string) {
    return await this.widgetsService.getWidget(id);
  }

  @Get('user/:id')
  @ApiOperation({ summary: 'Get all widgets of an user' })
  @ApiOkResponse({ description: 'Widgets of that user successfully found' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async getWidgetsOf(@Param('id') id: string) {
    return await this.widgetsService.getWidgetsOf(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get widgets' })
  @ApiOkResponse({ description: 'Widgets successfully found' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async getWidgets() {
    return await this.widgetsService.getWidgets();
  }

  @Post()
  @ApiOperation({ summary: 'Create a widget' })
  @ApiOkResponse({ description: 'Widget successfully created' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async createWidget(@Body() body: WidgetCreateDto) {
    return await this.widgetsService.create(body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a widget' })
  @ApiOkResponse({ description: 'Widget successfully destroy' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async deleteWidget(@Param("id") id: string) {
    return await this.widgetsService.delete(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a widget' })
  @ApiOkResponse({ description: 'Widget successfully updated' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async updateWidget(@Param('id') id: string, @Body() body: WidgetUpdateDto) {
    return await this.widgetsService.update(id, body);
  }

}