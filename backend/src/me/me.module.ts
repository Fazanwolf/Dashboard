import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { TokensModule } from '../tokens/tokens.module';
import { ServicesModule } from '../services/services.module';
import { WidgetsModule } from '../widgets/widgets.module';
import { JwtModule } from '@nestjs/jwt';
import { MeController } from './me.controller';
import { MeService } from './me.service';
import { jwt } from '../_tools/Config';

@Module({
  imports: [
    UsersModule,
    TokensModule,
    ServicesModule,
    WidgetsModule,
    JwtModule.register({
      secret: `${jwt.secret}`,
      signOptions: { expiresIn: `${jwt.expire}` },
    }),
  ],
  controllers: [MeController],
  providers: [MeService],
  exports: [MeService],
})
export class MeModule {}