import { ApiProperty } from '@nestjs/swagger';

export class PapiDto {
  @ApiProperty()
  pageSize?: number;

  @ApiProperty()
  ethnicity?: string;

  @ApiProperty()
  nationality?: string;

  @ApiProperty()
  eyes?: string;

  @ApiProperty()
  hair?: string;

  @ApiProperty()
  tattoos?: string;

  @ApiProperty()
  min_age?: number;

  @ApiProperty()
  max_age?: number;

  @ApiProperty()
  min_cup_size?: string;

  @ApiProperty()
  max_cup_size?: string;

  @ApiProperty()
  min_waist?: string;

  @ApiProperty()
  max_waist?: string;

  @ApiProperty()
  min_weight?: string;

  @ApiProperty()
  max_weight?: string;

  @ApiProperty()
  name?: string;

  @ApiProperty()
  max_rank?: string;

  @ApiProperty()
  min_rank?: string;
}