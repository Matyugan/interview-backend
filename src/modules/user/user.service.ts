import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';

import { CreateUserDto } from '@/modules/user/DTO/createUser.dto';
import { User } from '@/modules/user/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const password = await argon2.hash(createUserDto.password);

    return this.userRepository.save({ ...createUserDto, password });
  }
}
