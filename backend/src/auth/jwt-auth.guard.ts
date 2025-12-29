import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './jwt.constants';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwt: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const auth = req.headers['authorization'];
    if (!auth) throw new UnauthorizedException('Missing authorization header');
    const parts = auth.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') throw new UnauthorizedException('Invalid authorization header');
    const token = parts[1];
    try {
      const payload = this.jwt.verify(token, { secret: jwtConstants.secret });
      // Ensure downstream code can rely on user._id (compatibility with how we store users)
      req.user = { ...payload, _id: payload.sub };
      return true;
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}