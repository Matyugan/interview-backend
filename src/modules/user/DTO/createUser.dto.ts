import { IsEmailUserAlreadyExist } from '@/modules/user/validators/IsEmailUserAlreadyExist.validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsStrongPassword,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Имя',
    example: 'Иван',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly firstName: string;

  @ApiProperty({
    description: 'Фамилия',
    example: 'Пронин',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly lastName: string;

  @ApiProperty({
    description: 'Отчество',
    example: 'Петрович',
  })
  @IsString()
  readonly patronymic?: string;

  @ApiProperty({
    description: 'Дата рождения',
    example: '09.04.1994',
  })
  @IsDateString({ strict: true, strictSeparator: true })
  readonly dateOfBirth?: string;

  @ApiProperty({
    description: 'Место жительства',
    example: 'Россия, г. Самара',
  })
  @IsString()
  readonly placeOfResidence?: string;

  @ApiProperty({
    description: 'Пароль',
    example: 'qwerty',
    required: true,
  })
  @IsNotEmpty()
  @IsStrongPassword({ minSymbols: 1, minLength: 6, minUppercase: 2 })
  readonly password: string;

  @ApiProperty({
    description: 'e-mail',
    example: 'pronin@mail.ru',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  @IsEmailUserAlreadyExist({
    message: 'Пользователь с таким E-mail уже существует',
  })
  readonly email: string;

  @ApiProperty({
    description: 'Номер телефона',
    example: '8-987-951-64-77',
  })
  @IsMobilePhone('ru-RU')
  readonly phoneNumber?: string;

  @ApiProperty({
    description: 'Фотография',
    example: 'Без примера',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly photo: string;

  @ApiProperty({
    description: 'Описание',
    example: 'Описание технологического стэка на котором работает специалист',
  })
  @IsString()
  readonly description?: string;

  @ApiProperty({
    description: 'Документы',
    example: 'Документы подтверждающие навыки специалиста',
  })
  @IsString()
  readonly documents?: string;
}
