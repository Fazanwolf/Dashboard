import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, Length, Max } from 'class-validator';

export class WidgetUpdateDto {

  @ApiProperty({
    required: false,
    type: String,
    description: 'Name of the widget',
    example: 'Number of servers',
  })

  @IsOptional()
  name?: string;

  @ApiProperty({
    required: false,
    description: 'Description of the widget',
    type: String,
    example: 'Discord is a free and secure all-in-one voice and text chat for gamers.',
  })
  @IsOptional()
  description?: string;

  @ApiProperty({
    required: false,
    description: 'Icon of the widget',
    type: String,
    example: 'none',
  })
  @IsOptional()
  icon?: string;

  @ApiProperty({
    required: false,
    description: 'State of the widget',
    type: Boolean,
    example: false,
  })
  @IsOptional()
  enabled?: boolean;

  @ApiProperty({
    required: false,
    description: 'Params of the widget  {key: ..., value: ...}',
    type: String,
    example: {
      key: "Age",
      value: "18",
    },
  })
  @IsOptional()
  params?: {
    key: string;
    value: string;
  };

}