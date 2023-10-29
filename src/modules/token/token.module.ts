import { Module } from '@nestjs/common';
import { TokenService } from '@/modules/token/token.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from '@/modules/token/entities/refreshToken.entity';

@Module({
  imports: [JwtModule, TypeOrmModule.forFeature([RefreshToken])],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
