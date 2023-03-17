import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class MeWidgetUpdateDto {
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