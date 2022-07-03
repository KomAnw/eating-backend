import { UserService } from './../user/user.service';
import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Res,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { SignInUserDto } from 'src/user/dto/signIn-user.dto';
import { SignUpUserDto } from 'src/user/dto/signUp-user.dto';
import { AuthenticationService } from './authentication.service';
import { JwtAuthenticationGuard } from './jwt-authentication.guard';
import { RequestWithUser } from './types';
import Archive from 'src/archive.json';

@Controller('authentication')
export class AuthenticationController {
  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
  ) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  async getUserByToken(@Req() request: RequestWithUser) {
    const user = request.user;
    return user;
  }

  @Post('registration')
  async registration(
    @Body() signUpUserDto: SignUpUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authenticationService.registration(signUpUserDto);
    console.log(user);
    const { login, email } = user;
    const cookie = await this.authenticationService.getCookieWithJwtToken(
      email,
      login,
    );
    res.setHeader('Set-Cookie', cookie);
    return user;
  }

  @Post('login')
  async login(
    @Body() signInUserDto: SignInUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authenticationService.login(signInUserDto);
    const { login, email } = user;
    const cookie = await this.authenticationService.getCookieWithJwtToken(
      email,
      login,
    );
    response.setHeader('Set-Cookie', cookie);
    return user;
  }

  @Post('logout')
  @UseGuards(JwtAuthenticationGuard)
  async logout(@Res({ passthrough: true }) response: Response) {
    response.setHeader(
      'Set-Cookie',
      this.authenticationService.getCookieForLogOut(),
    );
    return response.sendStatus(200);
  }

  @Post('checkLogin')
  async checkLogin(@Body() { login }: { login: string }) {
    const user = await this.userService.findByLogin(login);

    if (user) {
      throw new HttpException(
        Archive.user.errors.emailAlreadyExist,
        HttpStatus.BAD_REQUEST,
      );
    }
    return false;
  }

  @Post('checkEmail')
  async checkEmail(@Body() { email }: { email: string }) {
    const user = await this.userService.findByEmail(email);

    if (user) {
      throw new HttpException(
        Archive.user.errors.emailAlreadyExist,
        HttpStatus.BAD_REQUEST,
      );
    }
    return false;
  }
}
