import { User } from '@/modules/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { IRefreshToken } from '@/modules/token/types/refreshToken.interface';

@Entity('refreshTokens')
export class RefreshToken implements IRefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: String,
    nullable: false,
  })
  refreshToken: string;

  @Column({
    type: 'timestamptz',
    nullable: false,
  })
  expireTime: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdDate: Date;

  @ManyToOne(() => User, (user) => user.refreshToken, { nullable: false })
  user: User;
}
