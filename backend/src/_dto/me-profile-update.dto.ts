import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsOptional, Length, Max } from 'class-validator';
import { RoleEnum } from '../_enums/Role.enum';

export class MeProfileUpdateDto {
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
    type: Number,
    description: 'Allow to  see adult content',
    example: 'false',
  })
  @IsOptional()
  @IsBoolean()
  adultContent?: number;

  @ApiProperty({
    required: false,
    type: Boolean,
    description: 'Allow to  see adult content',
    example: 'false',
  })
  @IsOptional()
  @IsBoolean()
  adultContent?: boolean;

}