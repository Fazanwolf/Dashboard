
import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty } from 'class-validator';

export class DiscordDto {
  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  code: string;

  @ApiProperty()
  state?: string;
}