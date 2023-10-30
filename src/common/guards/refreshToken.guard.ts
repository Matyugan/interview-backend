import { TokenService } from './../../modules/token/token.service';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private tokenService: TokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const refreshTokenId = this.getRefreshTokenFromRequest(request);

    if (!refreshTokenId) {
      throw new UnauthorizedException('Ошибка аутентификации');
    }

    const refreshToken = await this.getRefreshTokenFromDataBase(refreshTokenId);

    if (!refreshToken) {
      throw new UnauthorizedException('Ошибка аутентификации');
    }

    try {
      await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('SECRET_REFRESH'),
      });
    } catch {
      throw new UnauthorizedException('Ошибка аутентификации');
    }

    return true;
  }

  /**
   * Возвращает идентификатор refresh токена из cookies
   *
   * @param request - данные запроса
   * @returns - см. описание метода
   */
  private getRefreshTokenFromRequest(request: Request): string | undefined {
    return request.cookies.refreshTokenId;
  }

  /**
   * Возвращает refresh токен из базы данных
   *
   * @param tokenId - идентификатор refresh токена
   * @returns - см. описание метода
   * @throws - выбрасывает исключение если произошла внутренняя ошибка
   */
  private async getRefreshTokenFromDataBase(
    tokenId: string,
  ): Promise<string | undefined> {
    try {
      const { refreshToken } =
        (await this.tokenService.findById(tokenId)) ?? {};

      return refreshToken;
    } catch {
      throw new UnauthorizedException('Ошибка аутентификации');
    }
  }
}
