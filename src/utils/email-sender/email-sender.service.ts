import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

export type RegisterUserData = {
  subject: string;
  template: string;
  email: string;
  templateData: Object;
}

@Injectable()
export class EmailSenderService {
  constructor(
    private mailerService: MailerService
  ) { }

  public async sendTestEmail(emailData: RegisterUserData): Promise<any> {
    return this.mailerService.sendMail({
      to: emailData.email,
      from: process.env.SMTP_FROM_EMAIL,
      subject: emailData.subject,
      template: emailData.template,
      context: { ...emailData.templateData, siteName: process.env.SITE_NAME }
    });
  }
}