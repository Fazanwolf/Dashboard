import { Module } from '@nestjs/common';
import { DiscordService } from './discord.service';
import { HttpModule } from '@nestjs/axios';
import { RedditService } from './reddit.service';
import { PapiService } from './papi.service';
import { WakatimeService } from './wakatime.service';
import { ThirdPartyController } from './thirdparty.controller';
import { TokensModule } from '../tokens/tokens.module';

@Module({
  imports: [HttpModule, TokensModule],
  exports: [
    DiscordService,
    RedditService,
    PapiService,
    WakatimeService
  ],
  providers: [
    DiscordService,
    RedditService,
    PapiService,
    WakatimeService,
  ],
  controllers: [ThirdPartyController]
})
export class ThirdpartyModule {}