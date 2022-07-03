export class JwtPayload {
  readonly email: string;
  readonly login: string;
  readonly exp: number;
  readonly iat: number;
}
