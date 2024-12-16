import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCategoryBody } from 'src/Custom/dtos/category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as cloudinary from 'cloudinary'; // تأكد من تثبيت الحزمة

@Injectable()
export class CategoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  private async uploadToCloudinary(fileBuffer: Buffer, folder: string): Promise<any> {
    return new Promise((resolve, reject) => {
      cloudinary.v2.uploader.upload_stream(
        { folder, resource_type: 'auto' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      ).end(fileBuffer);
    });
  }

  async createCategory(
    body: createCategoryBody,
    file: Express.Multer.File,
    userId: number,
  ) {
    // تحقق من وجود الملف
    if (!file) {
      throw new NotFoundException('File not provided for category creation.');
    }

    // رفع الصورة إلى Cloudinary
    const nameFolder = this.configService.get<string>('CLOUD_FOLDER_NAME');
    const { public_id, secure_url } = await this.uploadToCloudinary(
      file.buffer,
      `${nameFolder}/category`,
    );

    // حفظ الصورة في قاعدة البيانات
    const image = await this.prisma.image.create({
      data: {
        public_id: public_id,
        secure_url: secure_url,
      },
    });

    // إنشاء الفئة (Category) وربط الصورة بها
    const createCategory = await this.prisma.category.create({
      data: {
        name: body.name,
        description: body.description,
        image: {
          connect: { id: image.id },
        },
        user: {
          connect: { id: userId },
        },
      },
    });

    console.log('createCategory', createCategory);

    return createCategory;
  }
}
