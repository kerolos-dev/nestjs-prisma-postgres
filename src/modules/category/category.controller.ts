import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Request,
  BadRequestException,
} from '@nestjs/common';
import * as cloudinary from 'cloudinary'; // تأكد من الاستيراد الصحيح
import { FileInterceptor } from '@nestjs/platform-express';
import { CategoryService } from './category.service';
import { createCategoryBody } from 'src/Custom/dtos/category.dto';
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Post('create')
  @UseInterceptors(FileInterceptor('image'))
  async createCategory(
    @Body() body: createCategoryBody,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,  // نستخدم req لاستخراج userId
  ) {
    const userId = req.user?.id; // تأكد من وجود user في الطلب
    if (!userId) {
      throw new BadRequestException('User not found in the request');
    }
    console.log(userId, body, file);
    return this.categoryService.createCategory(body, file, userId);
  }
}