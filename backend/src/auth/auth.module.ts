import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwt } from '../_tools/Config';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from '../_stategies/jwt.stategy';
import { EmailModule } from '../email/email.module';

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
  ],
  exports: [AuthService],
})
export class AuthModule {}