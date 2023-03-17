import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsOptional, Length, Max } from 'class-validator';

export class TokenCreateDto {

  @ApiProperty({
    required: true,
    type: String,
    description: 'Proprietary of the token',
    example: 'John Doe',
  })
  user: string;

}