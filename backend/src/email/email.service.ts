import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { mailjet } from '../_tools/Config';
import { EmailDto } from '../_dto/email.dto';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendForgotMail(emailDto: EmailDto) {
    const url: string = "http://localhost:8081/reset-password?token=" + emailDto.token;
    const info = await this.mailerService.sendMail({
      to: emailDto.email,
      from: '"[NO-REPLY] DASHBOARD" ' + mailjet.email,
      subject: 'Forgot password!?',
      template: './forgot',
      context: {
        url,
      },
    });
    console.log(info);
    return { message: "Mail sent" };
  }

  async sendValidationMail(emailDto: EmailDto) {
    const url: string = "http://localhost:8080/auth/verifyAccount?token=" + emailDto.token;
    const info = await this.mailerService.sendMail({
      to: emailDto.email,
      from: '"[NO-REPLY] DASHBOARD" ' + mailjet.email,
      subject: 'Verification account',
      template: './check',
      context: {
        url,
      },
    });
    return { sent: true };
  }
}