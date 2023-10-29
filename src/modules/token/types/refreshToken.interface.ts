import { IUser } from '@/modules/user/types/user.interface';

export interface IRefreshToken {
  id: string;
  refreshToken: string;
  expireTime: string;
  createdDate: Date;
  userId: IUser['id'];
}
