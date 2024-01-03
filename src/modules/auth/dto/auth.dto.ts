import { IsEmailUserAlreadyExist } from '@/modules/user/validators/IsEmailUserAlreadyExist.validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthDto {
  @ApiProperty({
    description: 'e-mail',
    example: 'test@mail.ru',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  @IsEmailUserAlreadyExist()
  readonly email: string;

  @ApiProperty({
    description: 'Пароль',
    example: 'qwerty',
    required: true,
  })
  @IsNotEmpty()
  readonly password: string;
}
