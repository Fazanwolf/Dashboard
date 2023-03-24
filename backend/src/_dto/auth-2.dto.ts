import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsEmpty, IsNotEmpty, Length } from 'class-validator';

export class Auth2Dto {
  @ApiProperty({
    description: 'Email of the user account that you forgot the password',
    type: String,
    example: 'example@example.com',
  })
  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  token: string;

  @ApiProperty({
    description: 'Plateform of the OAuth2',
    type: String,
    example: 'discord',
  })
  @IsDefined()
  @IsNotEmpty()
  platform: string;
}