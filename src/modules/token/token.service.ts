import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from '@/modules/token/entities/refreshToken.entity';
import { DeleteResult, Repository } from 'typeorm';
import { IRefreshToken } from '@/modules/token/types/refreshToken.interface';
import { v4 as uuidv4 } from 'uuid';

interface ITokenService {
  generateAccessToken(userId: string, username: string): string;
  saveRefreshToken(
    refreshTokenData: Pick<
      IRefreshToken,
      'refreshToken' | 'user' | 'expireTime'
    >,
  ): Promise<RefreshToken>;
  deleteRefreshToken(refreshTokenId: string): Promise<DeleteResult>;
  findById(refreshTokenId: string): Promise<RefreshToken | null>;
  updateTokens(
    refreshTokenId: string,
  ): Promise<{ accessToken: string; refreshToken: RefreshToken }>;
}
@Injectable()
export class TokenService implements ITokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(RefreshToken)
    private readonly tokenRepository: Repository<RefreshToken>,
  ) {}

  /**
   * Генерирует access токен
   *
   * @param userId - идентификатор пользователя
   * @param username - имя пользоваетля
   * @returns - токен
   */
  generateAccessToken(userId: string, username: string): string {
    return this.jwtService.sign({
      sub: userId,
      username,
    });
  }

  /**
   * Генерирует refresh токен
   *
   * @returns - токен
   */
  generateRefreshToken(): Pick<IRefreshToken, 'refreshToken' | 'expireTime'> {
    const dateNow = new Date();

    const expireTime = new Date(
      dateNow.setSeconds(
        dateNow.getSeconds() +
          Number(
            this.configService.get<string>(
              'EXPIRE_TIME_SECONDS_4_REFRESH_TOKEN',
            ),
          ),
      ),
    );

    return {
      refreshToken: uuidv4(),
      expireTime,
    };
  }

  /**
   * Сохраняет refresh токен в базу данных
   *
   * @param refreshTokenData - данные refresh токена
   * @returns данные refresh токена
   * @throws выбрасывает исключение, если произошла внутренняя ошибка
   */
  async saveRefreshToken(
    refreshTokenData: Pick<
      IRefreshToken,
      'refreshToken' | 'user' | 'expireTime'
    >,
  ): Promise<RefreshToken> {
    return await this.tokenRepository.save(refreshTokenData);
  }

  /**
   * Удаляет refresh токен из базы
   *
   * @param refreshTokenId - идентификатор refresh токена
   * @returns - результат операции
   * @throws выбрасывает исключение, если произошла внутренняя ошибка
   */
  async deleteRefreshToken(refreshTokenId: string): Promise<DeleteResult> {
    return await this.tokenRepository.delete({ id: refreshTokenId });
  }

  /**
   * Ищет и возвращает refresh токен по идентификатору
   *
   * @param refreshTokenId - идентификатор токена
   * @returns возвращает refresh токен
   * @throws выбрасывает исключение, если произошла внутренняя ошибка
   */
  async findById(refreshTokenId: string): Promise<RefreshToken | null> {
    return await this.tokenRepository.findOne({
      where: {
        id: refreshTokenId,
      },
      relations: ['user'],
    });
  }

  /**
   * Обновляет токены
   *
   * @param refreshTokenId - идентификатор токена
   * @returns возвращает перегенерированные токены
   * @throws выбрасывает исключение, если произошла внутренняя ошибка
   */
  async updateTokens(
    refreshTokenId: string,
  ): Promise<{ accessToken: string; refreshToken: RefreshToken }> {
    if (!refreshTokenId) {
      throw new UnauthorizedException('Ошибка аутентификации');
    }

    const tokenData = await this.findById(refreshTokenId);

    if (!tokenData.refreshToken) {
      throw new UnauthorizedException('Ошибка аутентификации');
    }

    const dateNow = new Date();

    if (dateNow > tokenData.expireTime) {
      throw new UnauthorizedException('Ошибка аутентификации');
    }

    const resultDelete = await this.deleteRefreshToken(refreshTokenId);

    if (resultDelete.affected) {
      const accessToken = this.generateAccessToken(
        tokenData.user.id,
        tokenData.user.firstName,
      );

      const refreshToken = this.generateRefreshToken();

      const savedRefreshToken = await this.saveRefreshToken({
        user: tokenData.user,
        ...refreshToken,
      });

      return {
        accessToken: accessToken,
        refreshToken: savedRefreshToken,
      };
    }
  }
}
