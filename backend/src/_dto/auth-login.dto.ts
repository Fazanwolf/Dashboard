import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsNotEmpty, Length } from 'class-validator';

export class AuthLoginDto {
  @ApiProperty({
    description: 'Email of the users',
    type: String,
    example: 'example@example.com',
  })
  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password of the users',
    type: String,
    minLength: 8,
    maxLength: 30,
    example: 'example123',
  })
  @IsDefined()
  @IsNotEmpty()
  @Length(8, 30)
  password: string;
}