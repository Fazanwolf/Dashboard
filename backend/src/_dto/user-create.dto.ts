import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsNotEmpty, Length } from 'class-validator';

export class UserCreateDto {
  @ApiProperty({
    description: 'Username of the user',
    type: String,
    minLength: 3,
    maxLength: 50,
    example: 'John Doe',
  })
  @IsDefined()
  @IsNotEmpty()
  @Length(3, 50)
  username: string;

  @ApiProperty({
    description: 'Email of the user',
    type: String,
    example: 'example@example.com',
  })
  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password of the user',
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