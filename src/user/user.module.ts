import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.Module';
import { JwtModule } from '@nestjs/jwt';
import { SendMessage } from 'src/utils/sendEmail';

@Module({
  controllers: [UserController  ],
  imports:[PrismaModule    , JwtModule   ,SendMessage ],
  providers: [PrismaService,UserService]
})
export class UserModule {}
