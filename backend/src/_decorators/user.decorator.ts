import { createParamDecorator } from '@nestjs/common';
import { MeDto } from "../_dto/me.dto";

export const AuthUser = createParamDecorator((data, req) => {
  const dto: MeDto = {
    username: req.args[0].user.username,
    email: req.args[0].user.email,
    role: req.args[0].user.role,
    id: req.args[0].user.id,
  };
  return dto;
});