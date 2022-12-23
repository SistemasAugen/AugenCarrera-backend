import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

export type RegisterUserData = {
  subject: string;
  template: string;
  email: string;
  templateData: Object;
}

export type RxEmailData = {
  subject: string;
  template: string;
  emailList: string[];
  file: Express.Multer.File;
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

  public async sendRxEmail(emailData: RxEmailData) {
    await emailData.emailList.map(async email => {
      try {
        await this.mailerService.sendMail({
          to: email,
          from: process.env.SMTP_FROM_EMAIL,
          subject: emailData.subject,
          template: emailData.template,
          attachments: [{
            filename: emailData.file.filename,
            content: emailData.file.buffer,
            contentType: emailData.file.mimetype
          }],
          context: { ...emailData.templateData, siteName: process.env.SITE_NAME }
        });
      } catch (ex) {
        console.log(ex);
      }
    })
  }
}