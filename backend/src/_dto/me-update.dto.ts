import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, Length } from 'class-validator';

export class MeUpdateDto {
  @ApiProperty({
    required: false,
    minLength: 3,
    maxLength: 50,
    type: String,
    description: 'Username of the user',
    example: 'John Doe',
  })
  @IsDefined()
  @Length(3, 50)
  username: string;
}