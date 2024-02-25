import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Имя',
    example: 'Иван',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly firstName?: string;

  @ApiPropertyOptional({
    description: 'Фамилия',
    example: 'Пронин',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly lastName?: string;

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

  @ApiPropertyOptional({
    description: 'Пароль',
    example: 'qwerty',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsStrongPassword({ minSymbols: 1, minLength: 6, minUppercase: 2 })
  readonly password?: string;

  @ApiPropertyOptional({
    description: 'e-mail',
    example: 'pronin@mail.ru',
  })
  @IsOptional()
  @IsEmail()
  @IsNotEmpty()
  readonly email?: string;

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
    required: true,
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
