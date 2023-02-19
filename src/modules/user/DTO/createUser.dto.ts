import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  readonly dateOfBirth: string;
  readonly phoneNumber: string;
  readonly placeOfResidence: string;
  readonly description: string;
  readonly documents: string;
  readonly patronymic: string;

  @IsNotEmpty()
  readonly firstName: string;

  @IsNotEmpty()
  readonly photo: string;

  @IsNotEmpty()
  readonly lastName: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;
}
