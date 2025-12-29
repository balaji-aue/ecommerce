import { Body, Controller, Delete, Get, Put, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CartsService } from './carts.service';

@Controller('carts')
export class CartsController {
  constructor(private cartsService: CartsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyCart(@Req() req: any) {
    const userId = req.user && req.user._id;
    if (!userId) throw new UnauthorizedException('Missing user id in token');
    return this.cartsService.getByUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('me')
  async setMyCart(@Req() req: any, @Body() body: { items: Array<{ product: string; qty: number }> }) {
    const userId = req.user && req.user._id;
    if (!userId) throw new UnauthorizedException('Missing user id in token');
    return this.cartsService.upsertByUser(userId, body.items || []);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me')
  async clearMyCart(@Req() req: any) {
    const userId = req.user && req.user._id;
    if (!userId) throw new UnauthorizedException('Missing user id in token');
    return this.cartsService.clear(userId);
  }
}
