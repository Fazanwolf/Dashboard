import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwt } from '../_tools/Config';
import { UsersModule } from '../user/users.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from '../_stategies/jwt.stategy';
import { EmailModule } from '../email/email.module';
import { Auth0Module } from '../auth0/auth0.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    EmailModule,
    PassportModule,
    JwtModule.register({
      secret: jwt.secret,
      signOptions: { expiresIn: `${jwt.expire}` },
    }),
    UsersModule,
    Auth0Module,
  ],
  exports: [AuthService],
})
export class AuthModule {}