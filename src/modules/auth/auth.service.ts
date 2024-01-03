import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDto } from '@/modules/user/dto/createUser.dto';
import { UserService } from '@/modules/user/user.service';
import * as argon2 from 'argon2';
import { AuthDto } from '@/modules/auth/dto/auth.dto';
import { TokenService } from '@/modules/token/token.service';
import { ICreatedUser } from '@/modules/user/types/createdUser.interface';
import { DataSource, DeleteResult } from 'typeorm';
import { RefreshToken } from '@/modules/token/entities/refreshToken.entity';
import { User } from '@/modules/user/entities/user.entity';

interface IAuthService {
  signUp(createUserDto: CreateUserDto): Promise<ICreatedUser>;
  signIn(userData: AuthDto): Promise<{
    accessToken: string;
    refreshToken: RefreshToken;
  }>;
  logout(refreshTokenId: string): Promise<DeleteResult>;
}

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private dataSource: DataSource,
  ) {}

  /**
   * Создает новоего пользователя в системе
   *
   * @param createUserDto - данные пользователя
   * @returns - данные созданного пользователя
   * @throws - выбрасывает исключение, если пользователь уже существует или произошла внутренняя ошибка
   */
  async signUp(createUserDto: CreateUserDto): Promise<ICreatedUser> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const password = await argon2.hash(createUserDto.password);

    try {
      const user = await queryRunner.manager.getRepository(User).save({
        ...createUserDto,
        password,
      });

      const accessToken = await this.tokenService.generateAccessToken(
        user.id,
        user.firstName,
      );

      const refreshToken = this.tokenService.generateRefreshToken();

      const savedRefreshToken = await queryRunner.manager
        .getRepository(RefreshToken)
        .save({
          ...refreshToken,
          user,
        });

      await queryRunner.commitTransaction();

      return {
        ...user,
        accessToken,
        refreshToken: savedRefreshToken,
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
   * @returns - токены
   * @throws - выбрасывает исключание, если пароли не совпадают
   */
  async signIn(userData: AuthDto): Promise<{
    accessToken: string;
    refreshToken: RefreshToken;
  }> {
    const user = await this.userService.findByEmail(userData.email);

    if (!user) {
      throw new BadRequestException('Некорректный логин или пароль');
    }

    const passwordMatches = await argon2.verify(
      user.password,
      userData.password,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Некорректный логин или пароль');
    }

    const accessToken = await this.tokenService.generateAccessToken(
      user.id,
      user.firstName,
    );

    const refreshToken = this.tokenService.generateRefreshToken();

    const savedRefreshToken = await this.tokenService.saveRefreshToken({
      ...refreshToken,
      user,
    });

    return {
      accessToken,
      refreshToken: savedRefreshToken,
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
