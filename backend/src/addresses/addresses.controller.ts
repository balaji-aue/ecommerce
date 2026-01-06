import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AddressesService } from './addresses.service';

@Controller('addresses')
export class AddressesController {
  constructor(private readonly service: AddressesService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyAddresses(@Req() req: any) {
    const userId = req.user && req.user._id;
    if (!userId) throw new UnauthorizedException('Missing user id in token');
    return this.service.findByUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('me')
  async addAddress(@Req() req: any, @Body() body: Partial<any>) {
    const userId = req.user && req.user._id;
    if (!userId) throw new UnauthorizedException('Missing user id in token');
    return this.service.create(userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateAddress(@Req() req: any, @Param('id') id: string, @Body() body: Partial<any>) {
    const userId = req.user && req.user._id;
    if (!userId) throw new UnauthorizedException('Missing user id in token');
    return this.service.update(userId, id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteAddress(@Req() req: any, @Param('id') id: string) {
    const userId = req.user && req.user._id;
    if (!userId) throw new UnauthorizedException('Missing user id in token');
    return this.service.remove(userId, id);
  }
}