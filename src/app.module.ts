import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.Module';
import { MailerModule } from './mailer/mailer.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule, UserModule, MailerModule ,  ConfigModule.forRoot({
    isGlobal: true, // Makes the ConfigModule available globally
  }),],
  controllers: [AppController],
  providers: [AppService ],
})
export class AppModule {}
