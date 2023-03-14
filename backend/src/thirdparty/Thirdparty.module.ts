import { Module } from '@nestjs/common';
import { DiscordService } from './discord.service';
// import { GmailService } from './gmail.service_repository';
// import { YoutubeService } from './youtube.service_repository';
import { MailerModule } from '@nestjs-modules/mailer';
import { HttpModule } from '@nestjs/axios';
// import { GithubService } from './github.service_repository';
// import { RedditService } from './reddit.service_repository';

@Module({
  imports: [HttpModule],
  exports: [
    DiscordService,
    // GmailService,
    // YoutubeService,
    // GithubService,
    // RedditService,
  ],
  providers: [
    DiscordService,
    // GmailService,
    // YoutubeService,
    // GithubService,
    // RedditService,
  ],
})
export class ThirdpartyModule {}