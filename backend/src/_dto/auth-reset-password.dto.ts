import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, Length } from 'class-validator';

export class AuthResetPasswordDto {
  @ApiProperty({
    description: 'The new password of the users',
    type: String,
    example: 'example974',
  })
  @IsDefined()
  @IsNotEmpty()
  @Length(8, 30)
  password: string;

  @ApiProperty({ description: 'Token', type: String })
  @IsDefined()
  @IsNotEmpty()
  token: string;
}