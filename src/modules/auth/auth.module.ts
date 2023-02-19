import { Module } from '@nestjs/common';
import { AuthController } from '@/modules/auth/auth.controller';
import { UserModule } from '@/modules/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
})
export class AuthModule {}
