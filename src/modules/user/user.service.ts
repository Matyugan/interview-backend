import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from '@/modules/user/dto/updateUser.dto';
import { User } from '@/modules/user/entities/user.entity';

interface IUserService {
  updateUser(id: string, userData: UpdateUserDto): void;
  findByEmail(email: string): Promise<User>;
  findById(id: string): Promise<User>;
}

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Обновляет данные пользователя
   *
   * @param userData - поля из тела запроса
   * @returns возвращает обновленного пользователя
   * @throws выбрасывает исключение если произошла внутренняя ошибка
   */
  async updateUser(id: string, userData: UpdateUserDto) {
    await this.userRepository.update(id, userData);
  }

  /**
   * Ищет и возвращает пользователя по e-mail
   *
   * @param email - электронная почта
   * @returns - возвращает найденного пользователя
   * @throws - выбрасывает исключение если произошла внутренняя ошибка или пользователя с указанным email не существует
   */
  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  /**
   * Ищет и возвращает пользователя по id
   *
   * @param id - идентификатор пользователя
   * @returns - возвращает найденного пользователя
   * @throws - выбрасывает исключение, если произошла внутренняя ошибка или пользователя с указанным id не существует
   */
  async findById(id: string): Promise<User> {
    let user: User | null = null;

    user = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: {
        refreshToken: true,
      },
    });

    if (!user) {
      throw new BadRequestException('Пользователя с заданным id не существует');
    }

    return user;
  }
}
