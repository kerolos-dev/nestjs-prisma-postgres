import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { log } from 'console';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly _jwtService: JwtService,
    private readonly prisma: PrismaService ,
    private readonly configService: ConfigService,  // Inject ConfigService

  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { token } = request.headers;
    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      const tokenSecret = this.configService.get<string>('JWT_SECRET');  // Get JWT secret from .env

      const payload = this._jwtService.verify(token, { secret: tokenSecret});
      // Check if the user exists
      const user = await this.prisma.user.findFirst({
        where: { id: payload.id },
      });

      if (!user) {  
        throw new UnauthorizedException('User not found');
      }
      return true;
    } catch (err) {
      console.log('error: ', err)
      throw new UnauthorizedException('Invalid token');
    }
  }
  
}
