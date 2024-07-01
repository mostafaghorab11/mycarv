import {
  AfterInsert,
  BeforeInsert,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

import * as bcrypt from 'bcrypt';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  email: string;

  @Column()
  password: string;

  @BeforeInsert()
  hashPassword() {
    // hash password before saving
    this.password = bcrypt.hashSync(this.password, 10);
  }

  @AfterInsert()
  logInsert() {
    console.log('user has been inserted with id: ' + this.id);
  }
}
