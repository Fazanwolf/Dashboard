import {CacheInterceptor, CacheModule, CacheStore, Module} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import {cache, db} from "../_tools/Config";
import {UsersModule} from "../users/users.module";
import redisStore from 'cache-manager-redis-store';
import { AuthModule } from '../auth/auth.module';
import { EmailModule } from '../email/email.module';
import { ThirdpartyModule } from '../thirdparty/Thirdparty.module';
import { TokensModule } from '../tokens/tokens.module';
import { ServicesModule } from '../services/services.module';
import { WidgetsModule } from '../widgets/widgets.module';
import { MeModule } from '../me/me.module';

@Module({
  imports: [
    MongooseModule.forRoot(db.uri),
    CacheModule.register({
      isGlobal: true,
      store: redisStore as unknown as CacheStore,
      host: cache.host,
      port: cache.port,
      ttl: cache.ttl,
    }),
    AuthModule,
    UsersModule,
    EmailModule,
    ThirdpartyModule,
    TokensModule,
    ServicesModule,
    WidgetsModule,
    MeModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
