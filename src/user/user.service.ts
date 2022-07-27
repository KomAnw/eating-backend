import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { sanitizeUser } from 'src/utils/sanitizeUser';
import { SignUpUserDto } from './dto/signUp-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email }).exec();
  }

  async findByLogin(login: string) {
    return await this.userModel.findOne({ login }).exec();
  }

  async create(signUpUserDto: SignUpUserDto) {
    const newUser = new this.userModel(signUpUserDto);
    await newUser.save();
    return sanitizeUser(newUser);
  }
}
