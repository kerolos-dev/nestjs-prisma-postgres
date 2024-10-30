import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
@Module({
  providers: [SendMessage],
  exports: [SendMessage], // Export it so other modules can use it
})
export class SendMessage {
  private transporter;

  constructor(private readonly configService: ConfigService) {
    const emailUser = this.configService.get<string>('EMAILUSER');
    const passwordUser = this.configService.get<string>('PASSUSER');

    // Assign directly to this.transporter
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // or your chosen service
      auth: {
        user: emailUser,
        pass: passwordUser,
      },
    });

    console.log('Nodemailer:', nodemailer);  // For debugging purposes
  }

  async send({ to, subject, text, html }: { to: string; subject: string; text: string; html: string }): Promise<boolean> {
    try {
      const info = await this.transporter.sendMail({
        from: `Kerolos E-commerce App 👻 <${this.configService.get<string>('EMAILUSER')}>`,
        to,
        subject,
        text,
        html,
      });

      return info.accepted.length > 0; // returns true if at least one recipient accepted the message
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }
}
