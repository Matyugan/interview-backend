import { RefreshToken } from '@/modules/token/entities/refreshToken.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { IUser } from '@/modules/user/types/user.interface';

@Entity('users')
export class User implements IUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: String,
  })
  firstName: string;

  @Column({
    type: String,
    nullable: true,
  })
  patronymic: string;

  @Column({
    type: String,
  })
  lastName: string;

  @Index({ unique: true })
  @Column({
    type: String,
  })
  email: string;

  @Column({
    type: String,
  })
  password: string;

  @Column({
    type: String,
    nullable: true,
  })
  dateOfBirth: string;

  @Column({
    type: String,
    nullable: true,
  })
  phoneNumber: string;

  @Column({
    type: String,
    nullable: true,
  })
  placeOfResidence: string;

  @Column({
    type: String,
    nullable: true,
  })
  description: string;

  @Column({
    type: String,
    nullable: true,
  })
  documents: string;

  @Column({
    type: String,
    nullable: true,
  })
  photo: string;

  @OneToMany(() => RefreshToken, (token) => token.user, { nullable: false })
  refreshToken: RefreshToken[];
}
