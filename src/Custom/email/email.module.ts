import { Module } from '@nestjs/common';
import { EmailService } from './email.service'; 
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/prisma/prisma.Module';

@Module({
  imports: [PrismaModule, ConfigModule], 
  providers: [EmailService],
  exports: [EmailService],  
})
export class EmailModule {}
