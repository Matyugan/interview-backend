import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: String,
  })
  firstName: string;

  @Column({
    type: String,
  })
  patronymic: string;

  @Column({
    type: String,
  })
  lastName: string;

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
  })
  dateOfBirth: string;

  @Column({
    type: String,
  })
  phoneNumber: string;

  @Column({
    type: String,
  })
  placeOfResidence: string;

  @Column({
    type: String,
  })
  description: string;

  @Column({
    type: String,
  })
  documents: string;

  @Column({
    type: String,
  })
  photo: string;

  @Column({
    type: String,
    nullable: true,
  })
  refreshToken: string;
}
