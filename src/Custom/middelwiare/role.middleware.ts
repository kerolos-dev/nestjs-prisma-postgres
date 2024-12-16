import {
  Inject,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class RoleMiddleware implements NestMiddleware {
  constructor(@Inject('ROLES') private readonly roles: string[]) {}

  use(req: any, res: any, next: () => void) {
    if (!req.userId) {
      throw new UnauthorizedException('User not found');
    }

    if (this.roles.length && this.roles[0] !== 'ADMIN') {
      throw new UnauthorizedException('User not authorized');
    }

    next();
  }
}
