import { sanitizeUser } from 'src/utils/sanitizeUser';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from 'src/schemas/order.schema';
import { UserService } from 'src/user/user.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(
    private userService: UserService,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const { customer } = createOrderDto;
    const user = await this.userService.findByLogin(customer);
    const newOrder = new this.orderModel({
      ...createOrderDto,
      customer: user,
    });
    await newOrder.save();
  }

  async findAll() {
    return await this.orderModel.find().populate('customer', '-password');
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
