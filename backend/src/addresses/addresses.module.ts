import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AddressesService } from './addresses.service';
import { AddressesController } from './addresses.controller';
import { Address, AddressSchema } from './address.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Address.name, schema: AddressSchema }]), AuthModule],
  providers: [AddressesService],
  controllers: [AddressesController]
})
export class AddressesModule {}
