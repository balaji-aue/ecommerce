import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private users: UsersService, private jwt: JwtService) {}

  async validateUser(email: string, password: string) {
    const u = await this.users.validatePassword(email, password);
    if (!u) return null;
    return u;
  }

  async login(user: any) {
    const payload = { sub: user._id, email: user.email, role: user.role };
    return { access_token: this.jwt.sign(payload) };
  }

  async register(data: any) {
    const u = await this.users.create(data);
    return { _id: u._id, email: u.email, role: u.role };
  }

  async update(userId: string, data: any) {
    // Pass through to UsersService to handle password hashing (if provided) and validation
    return this.users.update(userId, data);
  }

  async me(userId: string) {
    return this.users.findOne(userId);
  }
}