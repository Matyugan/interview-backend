import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Имя',
    example: 'Иван',
    required: true,
  })
  @IsNotEmpty()
  readonly firstName: string;

  @ApiProperty({
    description: 'Фамилия',
    example: 'Пронин',
    required: true,
  })
  @IsNotEmpty()
  readonly lastName: string;

  @ApiProperty({
    description: 'Отчество',
    example: 'Петрович',
  })
  readonly patronymic?: string;

  @ApiProperty({
    description: 'Дата рождения',
    example: '09.04.1994',
  })
  readonly dateOfBirth?: string;

  @ApiProperty({
    description: 'Место жительства',
    example: 'Россия, г. Самара',
  })
  readonly placeOfResidence?: string;

  @ApiProperty({
    description: 'Пароль',
    example: 'qwerty',
    required: true,
  })
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({
    description: 'e-mail',
    example: 'pronin@mail.ru',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    description: 'Номер телефона',
    example: '8-987-951-64-77',
  })
  readonly phoneNumber?: string;

  @ApiProperty({
    description: 'Фотография',
    example: 'Без примера',
    required: true,
  })
  @IsNotEmpty()
  readonly photo: string;

  @ApiProperty({
    description: 'Описание',
    example: 'Описание технологического стэка на котором работает специалист',
  })
  readonly description?: string;

  @ApiProperty({
    description: 'Документы',
    example: 'Документы подтверждающие навыки специалиста',
  })
  readonly documents?: string;
}
