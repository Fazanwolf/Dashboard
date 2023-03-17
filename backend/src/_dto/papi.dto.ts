import { ApiProperty } from '@nestjs/swagger';

export class PapiDto {
  @ApiProperty()
  ethnicity?: string;

  @ApiProperty()
  nationality?: string;

  @ApiProperty()
  eyes?: string;

  @ApiProperty()
  name?: string;

  @ApiProperty()
  max_rank?: string;

  @ApiProperty()
  min_rank?: string;
}