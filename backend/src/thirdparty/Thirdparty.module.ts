import { Module } from '@nestjs/common';
import { DiscordService } from './discord.service';
// import { GmailService } from './gmail.service_repository';
import { MailerModule } from '@nestjs-modules/mailer';
import { HttpModule } from '@nestjs/axios';
import { RedditService } from './reddit.service';
import { PapiService } from './papi.service';
import { WakatimeService } from './wakatime.service';
// import { GithubService } from './github.service_repository';

@Module({
  imports: [HttpModule],
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
})
export class ThirdpartyModule {}