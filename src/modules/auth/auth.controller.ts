import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '@/modules/user/user.service';
import { CreateUserDto } from '@/modules/user/DTO/createUser.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private userService: UserService) {}

  @Post('signup')
  signUp(@Body() createUserDto: CreateUserDto) {
    const user = this.userService.createUser(createUserDto);
    return user;
  }
}
