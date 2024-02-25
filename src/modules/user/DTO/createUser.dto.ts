import { IsEmailUserAlreadyExist } from '@/modules/user/validators/IsEmailUserAlreadyExist.validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsStrongPassword,
  IsString,
  IsOptional,
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

  @ApiPropertyOptional({
    description: 'Отчество',
    example: 'Петрович',
  })
  @IsOptional()
  @IsString()
  readonly patronymic?: string;

  @ApiPropertyOptional({
    description: 'Дата рождения',
    example: '09.04.1994',
  })
  @IsOptional()
  @IsDateString({ strict: true, strictSeparator: true })
  readonly dateOfBirth?: string;

  @ApiPropertyOptional({
    description: 'Место жительства',
    example: 'Россия, г. Самара',
  })
  @IsOptional()
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

  @ApiPropertyOptional({
    description: 'Номер телефона',
    example: '8-987-951-64-77',
  })
  @IsOptional()
  @IsMobilePhone('ru-RU')
  readonly phoneNumber?: string;

  @ApiPropertyOptional({
    description: 'Фотография',
    example: 'Без примера',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly photo?: string;

  @ApiPropertyOptional({
    description: 'Описание',
    example: 'Описание технологического стэка на котором работает специалист',
  })
  @IsOptional()
  @IsString()
  readonly description?: string;

  @ApiPropertyOptional({
    description: 'Документы',
    example: 'Документы подтверждающие навыки специалиста',
  })
  @IsOptional()
  @IsString()
  readonly documents?: string;
}
