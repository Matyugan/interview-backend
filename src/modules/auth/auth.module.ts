import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from '@/modules/auth/auth.controller';
import { UserModule } from '@/modules/user/user.module';
import { AuthService } from '@/modules/auth/auth.service';
import { TokenModule } from '@/modules/token/token.module';
import { AccessTokenStrategy } from '@/modules/auth/strategies/accessToken.strategy';
import { RefreshTokenStrategy } from '@/modules/auth/strategies/refreshToken.strategy';

@Module({
  imports: [UserModule, TokenModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
