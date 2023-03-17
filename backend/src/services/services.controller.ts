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
import { ServicesService } from './services.service';
import { RoleEnum } from '../_enums/Role.enum';
import { Roles } from '../_decorators/role.decorator';
import { JwtAuthGuard } from '../_guards/jwt.guard';
import { RolesGuard } from '../_guards/role.guard';
import { ServiceUpdateDto } from '../_dto/service-update.dto';
import { ServiceCreateDto } from '../_dto/service-create.dto';

@Controller('services')
@ApiTags('Services')
@ApiBearerAuth()
@ApiNotFoundResponse({ description: 'Service not found' })
@ApiUnauthorizedResponse({ description: 'Invalid credentials' })
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get a service' })
  @ApiOkResponse({ description: 'Service successfully found' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async getService(@Param('id') id: string) {
    return await this.servicesService.getService(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get services' })
  @ApiOkResponse({ description: 'Services successfully found' })
  @UseGuards(JwtAuthGuard)
  async getServices() {
    return await this.servicesService.getServices();
  }

  @Post()
  @ApiOperation({ summary: 'Create a service' })
  @ApiOkResponse({ description: 'Service successfully created' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async createService(@Body() body: ServiceCreateDto) {
    return await this.servicesService.create(body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a service' })
  @ApiOkResponse({ description: 'Service successfully destroy' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async deleteService(@Param("id") id: string) {
    return await this.servicesService.delete(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a service' })
  @ApiOkResponse({ description: 'Service successfully updated' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async updateService(@Param('id') id: string, @Body() body: ServiceUpdateDto) {
    return await this.servicesService.update(id, body);
  }

}