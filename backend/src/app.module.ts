import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CartsModule } from './carts/carts.module';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce'),
    ProductsModule,
    OrdersModule,
    UsersModule,
    AuthModule,
    // Cart persistence for authenticated users
    CartsModule
  ]
})
export class AppModule {}
