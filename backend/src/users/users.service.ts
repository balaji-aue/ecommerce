import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(data: Partial<User>): Promise<UserDocument> {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(data.password || '', salt);
    const created = new this.userModel({ ...data, password: hashed });
    return created.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().select('-password').lean();
  }

  async findOne(id: string): Promise<User> {
    const u = await this.userModel.findById(id).select('-password').lean();
    if (!u) throw new NotFoundException('User not found');
    return u;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async validatePassword(email: string, plain: string): Promise<UserDocument | null> {
    const user = await this.userModel.findOne({ email });
    if (!user) return null;
    const ok = await bcrypt.compare(plain, user.password);
    return ok ? (user as UserDocument) : null;
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }
    const updated = await this.userModel.findByIdAndUpdate(id, data, { new: true }).select('-password').lean();
    if (!updated) throw new NotFoundException('User not found');
    return updated;
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const r = await this.userModel.findByIdAndDelete(id);
    return { deleted: !!r };
  }
}