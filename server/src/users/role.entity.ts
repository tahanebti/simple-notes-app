import { BaseEntity } from "src/database/base.entity";
import { Column, Entity, ManyToMany } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Role extends BaseEntity {
 
   @Column({ nullable: false, unique: true })
  public name: string

  @ManyToMany(type => User, user => user.roles)
  public users: User[];
}