import { TokenModule } from '@/modules/token/token.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '@/modules/user/user.service';
import { User } from '@/modules/user/entities/user.entity';
import { IsEmailUserAlreadyExistConstraint } from '@/common/validators/IsEmailUserAlreadyExist.validator';

@Module({
  imports: [TokenModule, TypeOrmModule.forFeature([User])],
  providers: [UserService, IsEmailUserAlreadyExistConstraint],
  exports: [UserService],
})
export class UserModule {}
