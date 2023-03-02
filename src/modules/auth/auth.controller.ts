import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '@/modules/user/dto/createUser.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '@/modules/auth/auth.service';
import { User } from '@/modules/user/entities/user.entity';
import { AuthDto } from '@/modules/auth/dto/auth.dto';
@ApiTags('auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto): Promise<User> {
    const user = await this.authService.signUp(createUserDto);
    return user;
  }

  @Post('signin')
  async signIn(@Body() authDto: AuthDto) {
    const tokens = await this.authService.signIn(authDto);
    return tokens;
  }
}
