import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsEmpty, IsNotEmpty, Length } from 'class-validator';

export class AuthForgotPasswordDto {
  @ApiProperty({
    description: 'Email of the user account that you forgot the password',
    type: String,
    example: 'example@example.com',
  })
  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}