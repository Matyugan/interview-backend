import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ITokens } from '@/modules/token/types/tokens.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from '@/modules/token/entities/refreshToken.entity';
import { DeleteResult, Repository } from 'typeorm';
import { IRefreshToken } from '@/modules/token/types/refreshToken.interface';

interface ITokenService {
  generateTokensPaire(userId: string, username: string): Promise<ITokens>;
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
  ): Promise<{ accessToken: string; refreshTokenId: string }>;
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
   * Генерирует access и refresh токены
   *
   * @param userId - идентификатор пользователя
   * @param username - имя пользоваетля
   * @returns - токены
   * @throws - выбрасывает исключение, если произошла внутренняя ошибка
   */
  async generateTokensPaire(
    userId: string,
    username: string,
  ): Promise<ITokens> {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(
          {
            sub: userId,
            username,
          },
          {
            secret: this.configService.get<string>('SECRET_ACCESS'),
            expiresIn: this.configService.get<string>('EXPIRE_TIME_ACCESS'),
          },
        ),
        this.jwtService.signAsync(
          {
            sub: userId,
            username,
          },
          {
            secret: this.configService.get<string>('SECRET_REFRESH'),
            expiresIn: this.configService.get<string>('EXPIRE_TIME_REFRESH'),
          },
        ),
      ]);

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
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
    try {
      return await this.tokenRepository.save(refreshTokenData);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * Удаляет refresh токен из базы
   *
   * @param refreshTokenId - идентификатор refresh токена
   * @returns - результат операции
   * @throws выбрасывает исключение, если произошла внутренняя ошибка
   */
  async deleteRefreshToken(refreshTokenId: string): Promise<DeleteResult> {
    try {
      return await this.tokenRepository.delete({ id: refreshTokenId });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * Ищет и возвращает refresh токен по идентификатору
   *
   * @param refreshTokenId - идентификатор токена
   * @returns возвращает refresh токен
   * @throws выбрасывает исключение, если произошла внутренняя ошибка
   */
  async findById(refreshTokenId: string): Promise<RefreshToken | null> {
    try {
      return await this.tokenRepository.findOne({
        where: {
          id: refreshTokenId,
        },
        relations: ['user'],
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
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
  ): Promise<{ accessToken: string; refreshTokenId: string }> {
    const { refreshToken, user } = (await this.findById(refreshTokenId)) ?? {};

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

    const resultDelete = await this.deleteRefreshToken(refreshTokenId);

    if (resultDelete.affected) {
      const tokens = await this.generateTokensPaire(user.id, user.firstName);

      const savedRefreshToken = await this.saveRefreshToken({
        user,
        expireTime: this.configService.get<string>('EXPIRE_TIME_REFRESH'),
        refreshToken: tokens.refreshToken,
      });

      return {
        accessToken: tokens.accessToken,
        refreshTokenId: savedRefreshToken.id,
      };
    }
  }
}
