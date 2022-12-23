import { HttpException, Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { EmailSenderService } from "src/utils/email-sender/email-sender.service";

const oneMb = 1000000;
const pdfmimeType = "application/pdf";
const minRandomNumber = 1;
const maxRandomNumber = 9999;

@Injectable()
export class DocumentsService {
  constructor(private emailSenderService: EmailSenderService) { }

  private generateRandomNumber() {
    const number = Math.floor(Math.random() * (minRandomNumber - maxRandomNumber) ) + minRandomNumber;
    const result = number.toString().padStart(4,'0');
    return result;
  }

  async uploadRx(file: Express.Multer.File) {
    if(file.size >= oneMb && file.mimetype != pdfmimeType) {
      throw new HttpException("Formato de archivo no permitido", 400);
    }
    let randomId = this.generateRandomNumber();
    file.filename = 'SF-' + randomId;
    await this.emailSenderService.sendRxEmail({
      emailList: [
        'leonardo.flores.t@outlook.com',
        'fany.fop@gmail.com'
      ],
      file: file,
      subject: 'Nueva RX Safilo', // 'SF-' + randomId
      template:  'rxEmail',
      templateData: {}
    })
  }
}