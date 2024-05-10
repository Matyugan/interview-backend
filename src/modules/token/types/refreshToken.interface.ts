import { IUser } from '@/modules/user/types/user.interface';

export interface IRefreshToken {
  id: string;
  refreshToken: string;
  expireTime: Date;
  createdDate: Date;
  user: IUser;
}
