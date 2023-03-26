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
    description: 'Resultat of the widget',
    type: String,
    example: "no_data"
  })
  @IsOptional()
  result?: string;

  @ApiProperty({
    required: false,
    description: 'Index of the widget',
    type: Number,
    example: -1
  })
  @IsOptional()
  idx?: number;

  @ApiProperty({
    required: false,
    description: 'Params of the widget  {key: ..., value: ...}',
    type: String,
    example: {
      key: "Age",
      value: "18",
      required: false,
      type: "number"
    },
  })
  @IsOptional()
  params?: {
    key: string;
    value: string;
    required: boolean;
    type: string;
  };
}