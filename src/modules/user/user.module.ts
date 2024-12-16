import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.Module';
import { JwtModule } from '@nestjs/jwt';
import { EmailService } from 'src/Custom/email/email.service';
// import { SendMessage } from 'src/Custom/utils/sendEmail';

@Module({
  controllers: [UserController],
  imports: [PrismaModule, JwtModule],
  providers: [PrismaService, UserService,EmailService],
})
export class UserModule {}
