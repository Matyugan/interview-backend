import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  patronymic: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  dateOfBirth: string;

  @Column()
  phoneNumber: string;

  @Column()
  placeOfResidence: string;

  @Column()
  description: string;

  @Column()
  documents: string;

  @Column()
  photo: string;
}
