import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.getToken(request);

    if (!token) {
      throw new UnauthorizedException('Ошибка аутентификации');
    }

    try {
      this.jwtService.verify(token, {
        secret: this.configService.get('SECRET_ACCESS'),
      });
    } catch {
      throw new UnauthorizedException('Ошибка аутентификации');
    }

    return true;
  }

  /**
   * Возвращает access токен из заголовков
   *
   * @param request - данные запроса
   * @returns - см. описание метода
   */
  getToken(request: Request): string | undefined {
    return request.headers.authorization;
  }
}
