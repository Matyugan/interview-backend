import { Exclude } from 'class-transformer';
import { ICreatedUser } from '@/modules/user/types/createdUser.interface';

export default class SerializedUser {
  constructor(data: ICreatedUser) {
    Object.assign(this, data);
  }

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
