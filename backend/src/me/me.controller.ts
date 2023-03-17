import {
  ApiBearerAuth, ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Headers, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../_guards/jwt.guard';
import { WidgetUpdateDto } from '../_dto/widget-update.dto';
import { UserUpdateDto } from '../_dto/user-update.dto';
import { MeService } from './me.service';
import { MeProfileUpdateDto } from '../_dto/me-profile-update.dto';
import { MeWidgetUpdateDto } from '../_dto/me-widget-update.dto';
import { WidgetCreateDto } from '../_dto/widget-create.dto';

@Controller('me')
@ApiTags('me')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiUnauthorizedResponse({ description: 'Invalid credentials' })
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
export class MeController {
  constructor(private readonly meService: MeService) {}

  @Get()
  @ApiOperation({ summary: 'Get my profile' })
  @ApiOkResponse({ description: 'My profile successfully found' })
  async getMe(@Headers() head) {
    return await this.meService.getMe(head['authorization'].split(' ')[1]);
  }

  @Patch()
  @ApiOperation({ summary: 'Update my profile' })
  @ApiOkResponse({ description: 'My profile successfully updated' })
  async updateMe(@Headers() head, @Body() body: MeProfileUpdateDto) {
    return await this.meService.updateMe(head['authorization'].split(' ')[1], body);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete my profile' })
  @ApiOkResponse({ description: 'My profile successfully deleted' })
  async deleteMe(@Headers() head) {
    return await this.meService.deleteMe(head['authorization'].split(' ')[1]);
  }

  @Get('services')
  @ApiOperation({ summary: 'Get my services' })
  @ApiOkResponse({ description: 'My services successfully found' })
  async getMyServices(@Headers() head) {
    return await this.meService.getMyServices(head['authorization'].split(' ')[1]);
  }

  @Get('widgets')
  @ApiOperation({ summary: 'Get my widgets' })
  @ApiOkResponse({ description: 'My widgets successfully found' })
  async getMyWidgets(@Headers() head) {
    return await this.meService.getMyWidgets(head['authorization'].split(' ')[1]);
  }

  @Post('widgets')
  @ApiOperation({ summary: 'Create a new widget' })
  @ApiCreatedResponse({ description: 'My widget successfully created' })
  async createMyWidget(@Headers() head, @Body() body: WidgetCreateDto) {
    return await this.meService.createMyWidget(head['authorization'].split(' ')[1], body);
  }

  @Patch('widgets/:id')
  @ApiOperation({ summary: 'Update one of my widgets' })
  @ApiOkResponse({ description: 'My widget successfully updated' })
  async updateMyWidget(@Headers() head, @Param('id') id: string, @Body() body: MeWidgetUpdateDto) {
    return await this.meService.updateMyWidget(head['authorization'].split(' ')[1], id, body);
  }

  @Delete('widgets/:id')
  @ApiOperation({ summary: 'Delete one of my widgets' })
  @ApiOkResponse({ description: 'My widget successfully deleted' })
  async deleteMyWidget(@Headers() head, @Param('id') id: string) {
    return await this.meService.deleteMyWidget(head['authorization'].split(' ')[1], id);
  }

}