import { ApiProperty } from '@nestjs/swagger';

export class Auth0Dto {
  @ApiProperty()
  client_id: string;

  @ApiProperty()
  id_token: string;
}