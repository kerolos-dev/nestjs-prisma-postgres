import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}
  getDatabaseUrl(): string {
    return this.configService.get<string>('DATABASE_URL'); // Access the environment variable
  }

  getPort(): number {
    return this.configService.get<number>('PORT'); // Access the PORT variable
  }
  getHello(): string {
    return 'Hello World!';
  }
}
