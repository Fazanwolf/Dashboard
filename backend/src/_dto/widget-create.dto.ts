import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class WidgetCreateDto {

  @ApiProperty({
    required: true,
    type: String,
    description: 'Proprietary of the token',
    example: 'John Doe',
  })
  user: string;

  @ApiProperty({
    required: true,
    type: String,
    description: 'Name of the widget',
    example: 'Number of servers',
  })
  name: string;

  @ApiProperty({
    required: true,
    description: 'Description of the widget',
    type: String,
    example: 'Show the number of server that you have on discord',
  })
  description: string;

  @ApiProperty({
    required: true,
    description: 'Icon of the widget',
    type: String,
    example: 'none',
  })
  icon: string;

  @ApiProperty({
    required: true,
    description: 'State of the widget',
    type: Boolean,
    example: false,
  })
  enabled: boolean;

  @ApiProperty({
    required: true,
    description: 'Params of the widget  {key: ..., value: ...}',
    type: String,
    example: {
      key: "Age",
      value: "18",
    },
  })
  params: {
    key: string;
    value: string;
  };

}