import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsOptional, Length, Max, Min } from 'class-validator';
import { RoleEnum } from '../_enums/Role.enum';

export class UserUpdateDto {
  @ApiProperty({
    required: false,
    minLength: 3,
    maxLength: 50,
    type: String,
    description: 'Username of the users',
    example: 'John Doe',
  })
  @IsOptional()
  @Length(3, 50)
  username?: string;

  @ApiProperty({
    required: false,
    description: 'Email of the users',
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
    description: 'Password of the users',
    example: 'example123',
  })
  @IsOptional()
  @Length(8, 30)
  password?: string;

  @ApiProperty({
    required: false,
    type: Boolean,
    description: 'State of the users',
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

  @ApiProperty({
    required: false,
    type: Boolean,
    description: 'Allow to  see adult content',
    example: 'false',
  })
  @IsOptional()
  @IsBoolean()
  adultContent?: boolean;

  @ApiProperty({
    required: false,
    description: 'Role of the users',
    enum: RoleEnum,
    example: RoleEnum.USER,
  })
  @IsOptional()
  role?: string;

  @ApiProperty({
    required: false,
    type: Number,
    description: 'Rate limit of the users',
    minimum: 1000 * 5,
    example: '3000',
  })
  @IsOptional()
  @Min(1000 * 5)
  rateLimit?: number;

}