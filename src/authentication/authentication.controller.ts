import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { SignInUserDto } from 'src/user/dto/signIn-user.dto';
import { SignUpUserDto } from 'src/user/dto/signUp-user.dto';
import { AuthenticationService } from './authentication.service';
import { JwtAuthenticationGuard } from './jwt-authentication.guard';

@Controller('authentication')
export class AuthenticationController {
  constructor(private authService: AuthenticationService) {}

  @Get('onlyauth')
  @UseGuards(JwtAuthenticationGuard)
  async hiddenInformation() {
    return 'hidden information';
  }

  @Get('anyone')
  async publicInformation() {
    return 'this can be seen by anyone';
  }

  @Post('registration')
  async registration(@Body() signUpUserDto: SignUpUserDto) {
    return await this.authService.registration(signUpUserDto);
  }

  @Post('login')
  async login(@Body() signInUserDto: SignInUserDto) {
    return await this.authService.login(signInUserDto);
  }
}
