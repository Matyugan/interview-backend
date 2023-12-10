import { Module } from '@nestjs/common';
import { TokenService } from '@/modules/token/token.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from '@/modules/token/entities/refreshToken.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET_ACCESS'),
        signOptions: {
          expiresIn: configService.get<string>('EXPIRE_TIME_ACCESS'),
        },
      }),
    }),
    TypeOrmModule.forFeature([RefreshToken]),
  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
