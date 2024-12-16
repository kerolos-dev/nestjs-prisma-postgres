import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(
    private prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    const emailUser = this.configService.get<string>('EMAILUSER');
    const passwordUser = this.configService.get<string>('PASSUSER');

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: passwordUser,
      },
    });
  }

  async sendEmail(options: { to: string, subject: string, text: string, html: string }) {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Something went wrong while sending the email!');
    }
  }
}

