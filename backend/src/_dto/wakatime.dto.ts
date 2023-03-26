import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsOptional, Length, Max, Min } from 'class-validator';
import { RoleEnum } from '../_enums/Role.enum';

export class WakatimeDto {
  @ApiProperty({
    required: true,
    type: String,
    description: 'Token of the user',
    example: 'example',
  })
  access_token: string;
  
}