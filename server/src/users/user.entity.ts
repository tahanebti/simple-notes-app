import { Account } from 'src/account/entities/account.entity';
import { RefreshToken } from 'src/auth/entities/refresh-token.entity';
import { BaseEntity } from 'src/database/base.entity';
import { Entity, Column, PrimaryGeneratedColumn, Generated, ManyToMany, JoinTable, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Role } from './role.entity';

@Entity()
export class User extends BaseEntity  {


  @Column({ nullable: false, unique: true })
  public username: string;

  @Column({ nullable: false })
  public password: string;


  @Column({ name: 'reset_token', nullable: false })
  @Generated('uuid')
  public resetToken: string;

  @Column({ name: 'reset_token_expiration', nullable: false, type: 'timestamp' })
  public resetTokenExpiration: Date;


  @ManyToMany(type => Role, role => role.users)
  @JoinTable({ name: 'user_role'})
  public roles: Role[];

  @OneToOne(type => Account, { nullable: false })
  @JoinColumn({ name: 'account_id' })
  public account: Account;

  @OneToMany(type => RefreshToken, token => token.id)
  public refreshTokens: RefreshToken[];

}