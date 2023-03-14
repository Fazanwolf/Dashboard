import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { EmailService } from './email.service';
import { mailjet } from '../_tools/Config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [],
      useFactory: () => ({
        transport: {
          host: mailjet.host,
          port: mailjet.port,
          secure: false,
          auth: {
            user: mailjet.user,
            pass: mailjet.pass,
          },
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  exports: [EmailService],
  providers: [EmailService],
})
export class EmailModule {}