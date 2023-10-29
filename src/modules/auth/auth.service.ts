import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { CreateUserDto } from '@/modules/user/dto/createUser.dto';
import { UserService } from '@/modules/user/user.service';
import * as argon2 from 'argon2';
import { AuthDto } from '@/modules/auth/dto/auth.dto';
import { TokenService } from '@/modules/token/token.service';
import { ICreatedUser } from '@/modules/user/types/createdUser.interface';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { RefreshToken } from '@/modules/token/entities/refreshToken.entity';
import { User } from '@/modules/user/entities/user.entity';

interface IAuthService {
  signUp(createUserDto: CreateUserDto): Promise<ICreatedUser>;
  signIn(userData: AuthDto): any;
}

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private configService: ConfigService,
    private dataSource: DataSource,
  ) {}

  /**
   * Создает новоего пользователя в системе
   *
   * @param createUserDto - данные пользователя
   * @returns данные созданного пользователя
   */
  async signUp(createUserDto: CreateUserDto): Promise<ICreatedUser> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const isUser = await this.userService.validateUserByEmail(
      createUserDto.email,
    );

    if (isUser) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    const password = await argon2.hash(createUserDto.password);

    try {
      const user = await queryRunner.manager.getRepository(User).save({
        ...createUserDto,
        password,
      });

      const tokensPair = await this.tokenService.generateTokensPaire(
        user.id,
        user.firstName,
      );

      const savedRefreshToken = await queryRunner.manager
        .getRepository(RefreshToken)
        .save({
          refreshToken: tokensPair.refreshToken,
          userId: user.id,
          expireTime: this.configService.get<string>('EXPIRE_TIME_REFRESH'),
        });

      await queryRunner.commitTransaction();

      delete user.password;

      return {
        ...user,
        refreshTokenId: savedRefreshToken.id,
        accessToken: tokensPair.accessToken,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Аутентифицирует пользователя в системе
   *
   * @param userData - данные пользователя
   * @returns токены
   */
  async signIn(userData: AuthDto) {
    const user = await this.userService.findByEmail(userData.email);

    const passwordMatches = await argon2.verify(
      user.password,
      userData.password,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Некорректный пароль');
    }

    const tokensPair = await this.tokenService.generateTokensPaire(
      user.id,
      user.firstName,
    );

    const savedRefreshToken = await this.tokenService.saveRefreshToken({
      refreshToken: tokensPair.refreshToken,
      userId: user.id,
      expireTime: this.configService.get<string>('EXPIRE_TIME_REFRESH'),
    });

    return {
      accessToken: tokensPair.accessToken,
      refreshTokenId: savedRefreshToken.id,
    };
  }

  /**
   * Выходит из системы
   *
   * @param userId - идентификатор пользователя
   * @returns - токены
   */
  async logout(refreshTokenId: string) {
    return this.tokenService.deleteRefreshToken(refreshTokenId);
  }
}
