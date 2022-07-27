import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import Archive from 'src/archive.json';
import { SignInUserDto } from './../user/dto/signIn-user.dto';
import { SignUpUserDto } from 'src/user/dto/signUp-user.dto';
import { validatePassword } from 'src/utils/validatePassword';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { sanitizeUser } from 'src/utils/sanitizeUser';
import { comparePasswords } from 'src/utils/comparePasswords';

@Injectable()
export class AuthenticationService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  public async registration(signUpUserDto: SignUpUserDto) {
    try {
      const { email, login, password, secondPassword } = signUpUserDto;

      const emailAlreadyExist = await this.userService.findByEmail(email);
      const loginAlreadyExist = await this.userService.findByLogin(login);
      const passwordsCompare = comparePasswords(password, secondPassword);

      switch (true) {
        case Boolean(emailAlreadyExist):
          throw Archive.user.errors.emailAlreadyExist;
        case Boolean(loginAlreadyExist):
          throw Archive.user.errors.loginAlreadyExist;
        case !passwordsCompare:
          throw Archive.user.errors.passwordsNotCompare;
        default:
          const newUser = await this.userService.create(signUpUserDto);
          return newUser;
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
      const { loginOrEmail, password } = signInUserDto;
      const userByEmail = await this.userService.findByEmail(loginOrEmail);
      const userByLogin = await this.userService.findByLogin(loginOrEmail);
      const user = userByEmail || userByLogin;

      const userPassword =
        user && (await validatePassword(password, user.password));

      if (userPassword) {
        const sanitizedUser = sanitizeUser(user);
        return sanitizedUser;
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

  public async getCookieWithJwtToken(email: string, login: string) {
    const payload = {
      email,
      login,
    };
    const access_token = this.jwtService.sign(payload);
    const { exp } = this.jwtService.verify(access_token);
    const cookieExpiration = new Date(exp * 1000).toUTCString();
    return `token=${access_token}; httpOnly; Path=/; SameSite=None; Secure; expires=${cookieExpiration};`;
  }

  public getCookieForLogOut() {
    return `token=; HttpOnly; Path=/; expires=0`;
  }
}
