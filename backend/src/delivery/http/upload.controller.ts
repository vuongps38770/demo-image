import { 
  Controller, 
  Post, 
  UseInterceptors, 
  UploadedFile, 
  BadRequestException, 
  Req 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from '../../application/upload/upload.service';
import * as express from 'express';

@Controller('api/upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: express.Request,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    const host = req.get('host') || 'localhost';
    const protocol = req.protocol;

    const result = await this.uploadService.uploadImage(
      file.buffer,
      file.originalname,
      file.mimetype,
      host,
      protocol,
    );

    return {
      url: result.url,
      filename: result.filename,
      originalname: file.originalname,
      size: file.size,
    };
  }
}
