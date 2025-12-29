import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './product.schema';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) {}

  async create(data: Partial<Product>): Promise<Product> {
    const created = new this.productModel(data);
    return created.save();
  }

  async findAll(filters?: { search?: string; category?: string; minPrice?: number; maxPrice?: number }): Promise<Product[]> {
    const query: any = {};
    if (filters) {
      if (filters.search) {
        query.$or = [
          { name: { $regex: filters.search, $options: 'i' } },
          { description: { $regex: filters.search, $options: 'i' } }
        ];
      }
      if (filters.category) query.category = filters.category;
      if (filters.minPrice || filters.maxPrice) {
        query.price = {};
        if (filters.minPrice) query.price.$gte = Number(filters.minPrice);
        if (filters.maxPrice) query.price.$lte = Number(filters.maxPrice);
      }
    }
    return this.productModel.find(query).lean();
  }

  async findOne(id: string): Promise<Product> {
    const p = await this.productModel.findById(id).lean();
    if (!p) throw new NotFoundException('Product not found');
    return p;
  }

  async update(id: string, data: Partial<Product>): Promise<Product> {
    const updated = await this.productModel.findByIdAndUpdate(id, data, { new: true }).lean();
    if (!updated) throw new NotFoundException('Product not found');
    return updated;
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const res = await this.productModel.findByIdAndDelete(id);
    return { deleted: !!res };
  }
}
