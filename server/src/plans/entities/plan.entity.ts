import { Account } from "src/account/entities/account.entity";
import { BaseEntity } from "src/database/base.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity()
export class Plan extends BaseEntity {
  @Column({ nullable: false, unique: true })
  public name: string;

  @OneToMany(type => Account, account => account.plan)
  public accounts: Account[];
}