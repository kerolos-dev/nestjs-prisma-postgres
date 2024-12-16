import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
  
  @Controller('uploads')
  export class UploadController {
    constructor(private readonly cloudinaryService: CloudinaryService) {}
  
    @Post('image')
    @UseInterceptors(FileInterceptor('file'))
    async uploadImage(@UploadedFile() file: Express.Multer.File) {
      try {
        const result = await this.cloudinaryService.uploadImage(file.buffer, 'uploads');
        return {
          message: 'Image uploaded successfully',
          url: result.secure_url,
        };
      } catch (error) {
        return {
          message: 'Failed to upload image',
          error: error.message,
        };
      }
    }
  }
  