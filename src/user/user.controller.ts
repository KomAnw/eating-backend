import { SignUpUserDto } from './dto/signUp-user.dto';
import { Controller, Post, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findByEmail(email: string) {
    return this.userService.findByEmail(email);
  }

  @Post()
  async create(signUpUserDto: SignUpUserDto) {
    return this.userService.create(signUpUserDto);
  }
}
