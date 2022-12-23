import { Body, Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express/multer";
import { DocumentsService } from "./documents.service";

@Controller('documents')
export class DocumentsController {
  constructor(private documentsService: DocumentsService) { }

  @Post('rx')
  @UseInterceptors(FileInterceptor('file'))
  uploadPdf(@Body() data, @UploadedFile() file: Express.Multer.File) {
    return this.documentsService.uploadRx(file);
  }
}
