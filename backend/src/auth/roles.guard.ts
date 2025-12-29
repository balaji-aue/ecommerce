import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler()) || this.reflector.get<string[]>('roles', context.getClass());
    if (!roles || roles.length === 0) return true;
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (!user || !user.role) throw new ForbiddenException('Missing role');
    if (!roles.includes(user.role)) throw new ForbiddenException('Insufficient role');
    return true;
  }
}