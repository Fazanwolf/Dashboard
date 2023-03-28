import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Headers, Param, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../_guards/jwt.guard';
import { MeService } from './me.service';
import { MeProfileUpdateDto } from '../_dto/me-profile-update.dto';
import { MeWidgetUpdateDto } from '../_dto/me-widget-update.dto';
import { WidgetCreateDto } from '../_dto/widget-create.dto';
import { Widget } from '../_schemas/widget.schema';

@Controller('me')
@ApiTags('me')
@ApiUnauthorizedResponse({ description: 'Invalid credentials' })
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
export class MeController {
  constructor(private readonly meService: MeService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get my profile' })
  @ApiOkResponse({ description: 'My profile successfully found' })
  async getMe(@Headers() head) {
    return await this.meService.getMe(head['authorization'].split(' ')[1]);
  }

  @Patch()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update my profile' })
  @ApiOkResponse({ description: 'My profile successfully updated' })
  async updateMe(@Headers() head, @Body() body: MeProfileUpdateDto) {
    const tmp = await this.meService.updateMe(head['authorization'].split(' ')[1], body);
    console.log(tmp);
    return tmp;
  }

  @Delete()
  @ApiOperation({ summary: 'Delete my profile' })
  @ApiOkResponse({ description: 'My profile successfully deleted' })
  async deleteMe(@Headers() head) {
    return await this.meService.deleteMe(head['authorization'].split(' ')[1]);
  }

  @Get('services')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get my services' })
  @ApiOkResponse({ description: 'My services successfully found' })
  async getMyServices(@Headers() head) {
    return await this.meService.getMyServices(head['authorization'].split(' ')[1]);
  }

  @Get('refresh')
  @ApiOperation({ summary: 'Refresh tokens' })
  @ApiOkResponse({ description: 'Tokens successfully refreshed' })
  @ApiQuery({ name: 'username', required: false, type: 'string' })
  @ApiQuery({ name: 'email', required: false, type: 'string' })
  @ApiQuery({ name: 'token', required: true, type: 'string' })
  @ApiQuery({ name: 'platform', required: true, type: 'string' })
  async refreshTokens(@Query() query: { email: string, token: string, platform: string }, @Res() res) {
    await this.meService.refreshTokens(query);
    res.redirect(`http://localhost:8081/services`);
  }

  @Get('checkRefresh')
  @ApiOperation({ summary: 'Check if need to refresh a token' })
  @ApiOkResponse({ description: 'Tokens successfully refreshed' })
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'id', required: true, type: 'string' })
  @ApiQuery({ name: 'platform', required: false, type: 'string' })
  async checkTokens(@Query() query: { id: string, platform?: string }): Promise<String> {
    return await this.meService.checkTokens(query);
  }

  @Get('widgets')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get my widgets' })
  @ApiOkResponse({ description: 'My widgets successfully found' })
  async getMyWidgets(@Headers() head) {
    const widgets = await this.meService.getMyWidgets(head['authorization'].split(' ')[1]);
    return widgets;
  }

  @Get('widgets/number')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get the number of widgets' })
  @ApiOkResponse({ description: 'Retrieve successfully the number of widget' })
  async getNumberOfWidgets(@Headers() head) {
    return await this.meService.getNumberOfWidgets(head['authorization'].split(' ')[1]);
  }

  @Patch('positions/widgets')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get the number of widgets' })
  @ApiOkResponse({ description: 'Retrieve successfully the number of widget' })
  async updatePosition(@Body() body) {
    console.log(body);
    return await this.meService.savePositions(body);
  }

  @Post('widgets')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new widget' })
  @ApiCreatedResponse({ description: 'My widget successfully created' })
  async createMyWidget(@Headers() head, @Body() body: WidgetCreateDto) {
    return await this.meService.createMyWidget(head['authorization'].split(' ')[1], body);
  }

  @Patch('widgets/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update one of my widgets' })
  @ApiOkResponse({ description: 'My widget successfully updated' })
  async updateMyWidget(@Headers() head, @Param('id') id: string, @Body() body: MeWidgetUpdateDto) {
    return await this.meService.updateMyWidget(head['authorization'].split(' ')[1], id, body);
  }

  @Delete('widgets/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete one of my widgets' })
  @ApiOkResponse({ description: 'My widget successfully deleted' })
  async deleteMyWidget(@Headers() head, @Param('id') id: string) {
    return await this.meService.deleteMyWidget(head['authorization'].split(' ')[1], id);
  }

}