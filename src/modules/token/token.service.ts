import { Injectable } from '@nestjs/common';
import { Tokens } from '@/modules/auth/types';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '@/modules/user/user.service';
import * as argon2 from 'argon2';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  /**
   * Генерирует access и refresh токены
   *
   * @param userId - идентификатор пользователя
   * @param username - имя пользоваетля
   * @returns - токены
   */
  async getTokens(userId: string, username: string): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('SECRET_ACCESS'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('SECRET_REFRESH'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Обновляет refresh токен
   *
   * @param userId - идентификатор пользователя
   * @param username - имя пользоваетля
   * @returns - токены
   */
  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.userService.updateUser(userId, {
      refreshToken: hashedRefreshToken,
    });
  }
}
