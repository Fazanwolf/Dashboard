import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../_schemas/user.schema';
import { jwt } from '../_tools/Config';
import { UsersService } from '../user/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwt.secret,
    });
  }

  async validate(payload: any) {
    const user: User = await this.userService.getOne(payload.id);

    if (user.verified == false)
      throw new UnauthorizedException('You should validated your account.');

    const isValid = payload.personalKey == user.personalKey;
    if (!isValid) throw new UnauthorizedException('Your account is loggout.');

    return {
      id: payload.id,
      username: payload.username,
      mail: payload.mail,
      roles: payload.roles,
      personalKey: payload.personalKey,
    };
  }
}