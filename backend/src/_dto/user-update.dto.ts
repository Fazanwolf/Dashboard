import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsOptional, Length, Max } from 'class-validator';

export class UserUpdateDto {
  @ApiProperty({
    required: false,
    minLength: 3,
    maxLength: 50,
    type: String,
    description: 'Username of the user',
    example: 'John Doe',
  })
  @IsOptional()
  @Length(3, 50)
  username?: string;

  @ApiProperty({
    required: false,
    description: 'Email of the user',
    type: String,
    example: 'example@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    required: false,
    minLength: 8,
    maxLength: 30,
    type: String,
    description: 'Password of the user',
    example: 'example123',
  })
  @IsOptional()
  @Length(8, 30)
  password?: string;

  @ApiProperty({
    required: false,
    type: Boolean,
    description: 'State of the user',
    example: 'true',
  })
  @IsOptional()
  @IsBoolean()
  verified?: boolean;

  @ApiProperty({
    required: false,
    type: String,
    description: 'Personal key',
    example: '0123abc01a012345a0a0a012',
  })
  @IsOptional()
  personalKey?: string;
}