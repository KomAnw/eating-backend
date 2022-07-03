import { SignUpUserDto } from './dto/signUp-user.dto';
import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import Archive from 'src/archive.json';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
}
