import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Address, AddressDocument } from './address.schema';

@Injectable()
export class AddressesService {
  constructor(@InjectModel(Address.name) private addressModel: Model<AddressDocument>) {}

  async findByUser(userId: string) {
    return this.addressModel.find({ user: userId }).sort({ isDefault: -1, createdAt: -1 }).exec();
  }

  async create(userId: string, payload: Partial<Address>) {
    if (payload.isDefault) await this.addressModel.updateMany({ user: userId }, { $set: { isDefault: false } });
    const doc = new this.addressModel({ ...payload, user: userId });
    return doc.save();
  }

  async update(userId: string, id: string, payload: Partial<Address>) {
    if (payload.isDefault) await this.addressModel.updateMany({ user: userId }, { $set: { isDefault: false } });
    return this.addressModel.findOneAndUpdate({ _id: id, user: userId }, { $set: payload }, { new: true }).exec();
  }

  async remove(userId: string, id: string) {
    return this.addressModel.findOneAndDelete({ _id: id, user: userId }).exec();
  }
}