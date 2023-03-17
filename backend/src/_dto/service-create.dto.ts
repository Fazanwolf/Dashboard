import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsOptional, Length, Max } from 'class-validator';
import { Prop } from '@nestjs/mongoose';

export class ServiceCreateDto {

  @ApiProperty({
    required: true,
    type: String,
    description: 'Name of the service',
    example: 'Discord',
  })
  name: string;

  @ApiProperty({
    required: true,
    description: 'Description of the service',
    type: String,
    example: 'Discord is a free and secure all-in-one voice and text chat for gamers.',
  })
  description: string;

  @ApiProperty({
    required: true,
    description: 'Icon of the service',
    type: String,
    example: 'none',
  })
  icon: string;

  @ApiProperty({
    required: true,
    description: 'Url of the service',
    type: String,
    example: 'https://discord.com/',
  })
  url: string;

  @ApiProperty({
    required: true,
    description: 'Widgets of the service',
    type: String,
    example: [
      "...",
      "...",
    ],
  })
  widgets: string[];

}