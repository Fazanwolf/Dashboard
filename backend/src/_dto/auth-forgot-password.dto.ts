import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, Length } from 'class-validator';

export class AuthForgotPasswordDto {
  @ApiProperty({
    description: 'New password of the user',
    type: String,
    minLength: 8,
    maxLength: 30,
    example: 'example974',
  })
  @IsDefined()
  @IsNotEmpty()
  @Length(8, 30)
  password: string;
}