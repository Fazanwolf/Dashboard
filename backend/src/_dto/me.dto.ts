import { ApiProperty } from '@nestjs/swagger';

export class MeDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  mail: string;

  @ApiProperty()
  roles: string;
}