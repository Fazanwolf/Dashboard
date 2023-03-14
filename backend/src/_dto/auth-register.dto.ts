import { PartialType } from '@nestjs/swagger';
import { UserCreateDto } from './user-create.dto';

export class AuthRegisterDto extends PartialType(UserCreateDto) {}