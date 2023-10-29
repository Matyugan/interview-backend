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
  refreshTokenId: string;
  accessToken: string;
}
