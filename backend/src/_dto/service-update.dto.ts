import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsOptional, Length, Max } from 'class-validator';

export class ServiceUpdateDto {

  @ApiProperty({
    required: false,
    type: String,
    description: 'Name of the service',
    example: 'Discord',
  })
  @IsOptional()
  name?: string;

  @ApiProperty({
    required: false,
    description: 'Description of the service',
    type: String,
    example: 'Discord is a free and secure all-in-one voice and text chat for gamers.',
  })
  @IsOptional()
  description?: string;

  @ApiProperty({
    required: false,
    description: 'Icon of the service',
    type: String,
    example: 'none',
  })
  @IsOptional()
  icon?: string;

  @ApiProperty({
    required: false,
    description: 'Url of the service',
    type: String,
    example: 'https://discord.com/',
  })
  @IsOptional()
  url?: string;

  @ApiProperty({
    required: false,
    description: 'Widgets of the service',
    type: String,
    example: [
      "...",
      "...",
    ],
  })
  @IsOptional()
  widgets?: string[];

}