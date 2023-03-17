import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsOptional, Length, Max } from 'class-validator';

export class TokenUpdateDto {

  @ApiProperty({
    required: false,
    type: String,
    description: 'Discord token',
    example: 'here_is_your_discord_token',
  })
  @IsOptional()
  discord?: string;

  @ApiProperty({
    required: false,
    description: 'Wakatime token',
    type: String,
    example: 'here_is_your_wakatime_token',
  })
  @IsOptional()
  wakatime?: string;

  @ApiProperty({
    required: false,
    type: String,
    description: 'Reddit token',
    example: 'here_is_your_reddit_token',
  })
  @IsOptional()
  @Length(8, 30)
  reddit?: string;
}