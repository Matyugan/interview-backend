import { RefreshToken } from '@/modules/token/entities/refreshToken.entity';

export interface ICreatedUser {
  firstName: string;
  lastName: string;
  patronymic?: string;
  dateOfBirth?: string;
  placeOfResidence?: string;
  email: string;
  phoneNumber?: string;
  photo: string;
  description?: string;
  documents?: string;
  accessToken: string;
  refreshToken: RefreshToken;
}
