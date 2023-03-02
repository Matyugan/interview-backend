import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';

import { CreateUserDto } from '@/modules/user/dto/createUser.dto';
import { UpdateUserDto } from '@/modules/user/dto/updateUser.dto';
import { User } from '@/modules/user/entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Создает нового пользоваля
   *
   * @param createUserDto - поля из тела запроса
   * @returns - возвращает нового пользователя
   */
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const isUser = await this.validateUserByEmail(createUserDto.email);

    if (isUser) {
      throw new BadRequestException(
        'Пользователь с таким email уже существует',
      );
    }

    const password = await argon2.hash(createUserDto.password);
    return this.userRepository.save({ ...createUserDto, password });
  }

  /**
   * Обновляет данные пользоваля
   *
   * @param updateUserDto - поля из тела запроса
   * @returns - возвращает нового пользователя
   */
  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    await this.userRepository.update(id, updateUserDto);
  }

  /**
   * Ищет и возвращает пользователя по e-mail
   *
   * @param email - e-mail
   * @returns - возвращает найденного пользователя
   */
  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new BadRequestException(
        'Пользователя с заданным e-mail не существует',
      );
    }

    return user;
  }

  /**
   * Проверяет наличие пользователя по электронной почте
   *
   * @param email - почта пользователя
   */
  async validateUserByEmail(email: string): Promise<boolean> {
    const user = await this.userRepository.find({ where: { email } });
    return user.length ? true : false;
  }
}
