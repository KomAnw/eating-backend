import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import Archive from 'src/archive.json';
import { SignInUserDto } from './../user/dto/signIn-user.dto';
import { SignUpUserDto } from 'src/user/dto/signUp-user.dto';
import { validatePassword } from 'src/utils/validatePassword';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthenticationService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  public async registration(signUpUserDto: SignUpUserDto) {
    try {
      const { email, login } = signUpUserDto;

      const emailAlreadyExist = await this.userService.findByEmail(email);
      const loginAlreadyExist = await this.userService.findByLogin(login);
      //TODO: compare passwords, 1 and 2 => add case

      switch (true) {
        case Boolean(emailAlreadyExist):
          throw Archive.user.errors.emailAlreadyExist;
        case Boolean(loginAlreadyExist):
          throw Archive.user.errors.loginAlreadyExist;
        default:
          return await this.userService.create(signUpUserDto);
      }
    } catch (error) {
      if (error) {
        throw new HttpException(error, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(
        Archive.commonErrors.baseError,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async login(signInUserDto: SignInUserDto) {
    try {
      const { email, password } = signInUserDto;
      const user = await this.userService.findByEmail(email);
      const userPassword =
        user && (await validatePassword(password, user.password));

      if (userPassword) {
        const payload = {
          email,
          login: user.login,
        };

        return {
          user,
          access_token: this.jwtService.sign(payload),
        };
      }

      throw Archive.user.errors.loginOrPasswordIsNotValid;
    } catch (error) {
      const message = error || Archive.commonErrors.baseError;
      const code = error
        ? HttpStatus.BAD_REQUEST
        : HttpStatus.INTERNAL_SERVER_ERROR;
      throw new HttpException(message, code);
    }
  }
}
