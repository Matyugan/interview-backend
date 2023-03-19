import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '@/modules/user/dto/createUser.dto';
import { UserService } from '@/modules/user/user.service';
import * as argon2 from 'argon2';
import { User } from '@/modules/user/entities/user.entity';
import { AuthDto } from '@/modules/auth/dto/auth.dto';
import { TokenService } from '@/modules/token/token.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
  ) {}

  /**
   * Создает новоего пользователя в системе
   *
   * @param createUserDto - данные пользователя
   * @returns - данные созданного пользователя
   */
  async signUp(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = await this.userService.createUser(createUserDto);

    const tokens = await this.tokenService.getTokens(
      createdUser.id,
      createdUser.firstName,
    );

    await this.tokenService.updateRefreshToken(
      createdUser.id,
      tokens.refreshToken,
    );

    return {
      ...createdUser,
      ...tokens,
    };
  }

  /**
   * Аутентифицирует пользователя в системе
   *
   * @param userData - данные пользователя
   * @returns - токены
   */
  async signIn(userData: AuthDto) {
    const user = await this.userService.findByEmail(userData.email);

    const passwordMatches = await argon2.verify(
      user.password,
      userData.password,
    );

    if (!passwordMatches) {
      throw new BadRequestException('Некорректный пароль');
    }

    const tokens = await this.tokenService.getTokens(user.id, user.firstName);

    await this.tokenService.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  /**
   * Выходит из системы
   *
   * @param userId - идентификатор пользователя
   * @returns - токены
   */
  async logout(userId: string) {
    return this.userService.updateUser(userId, { refreshToken: null });
  }
}
