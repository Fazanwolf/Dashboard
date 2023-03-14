import { createParamDecorator } from '@nestjs/common';
import { MeDto } from "../_dto/me.dto";

export const AuthUser = createParamDecorator((data, req) => {
  const dto: MeDto = {
    username: req.args[0].user.username,
    mail: req.args[0].user.mail,
    roles: req.args[0].user.roles,
    id: req.args[0].user.id,
  };
  return dto;
});