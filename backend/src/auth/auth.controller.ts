import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('login')
  async login(@Body() body: any) {
    const user = await this.auth.validateUser(body.email, body.password);
    if (!user) return { status: 401, message: 'Invalid credentials' };
    return this.auth.login(user);
  }

  @Post('register')
  async register(@Body() body: any) {
    // default role = "user"
    return this.auth.register(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: any) {
    const userId = req.user && (req.user._id || req.user.sub);
    return this.auth.me(userId);
  }
}