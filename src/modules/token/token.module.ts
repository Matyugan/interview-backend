import { Module } from '@nestjs/common';
import { UserModule } from '@/modules/user/user.module';
import { TokenService } from '@/modules/token/token.service';
import { JwtService } from '@nestjs/jwt';
@Module({
  imports: [UserModule],
  providers: [TokenService, JwtService],
  exports: [TokenService],
})
export class TokenModule {}
