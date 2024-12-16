import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { CategoryModule } from './modules/category/category.module';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.Module';
import { EmailModule } from './Custom/email/email.module';
import { UploadModule } from './Custom/upload/upload.module';
import { CloudinaryController } from './Custom/cloudinary/cloudinary.controller';
import { CloudinaryService } from './Custom/cloudinary/cloudinary.service';
import { CloudinaryModule } from './Custom/cloudinary/cloudinary.module';

@Module({
  imports: [
    UserModule,
    CategoryModule,
    ConfigModule.forRoot({
      isGlobal: true, // Makes the ConfigModule available globally
    }),
    EmailModule,
    PrismaModule,
    UploadModule,
    CloudinaryModule,
    
  ],
  controllers: [AppController, CloudinaryController, ],
  providers: [AppService, CloudinaryService],
  exports: [CloudinaryService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
