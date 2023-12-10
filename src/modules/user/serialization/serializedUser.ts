import { Exclude } from 'class-transformer';

export default class SerializedUser {
  firstName: string;

  lastName: string;

  patronymic: string;

  dateOfBirth: string;

  placeOfResidence: string;

  email: string;

  phoneNumber: string;

  photo: string;

  description: string;

  documents: string;

  accessToken: string;

  @Exclude({ toPlainOnly: true })
  refreshToken: string;

  @Exclude({ toPlainOnly: true })
  password: string;
}
