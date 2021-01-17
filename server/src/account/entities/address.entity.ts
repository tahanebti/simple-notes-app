import { BaseEntity } from "src/database/base.entity";
import { Column, Entity, OneToOne } from "typeorm";
import { Profile } from "./profile.entity";


@Entity()
export class Address extends BaseEntity {
    
    @Column({ nullable: false })
    public street: string;
  
    @Column({ nullable: true })
    public street2: string;
  
    @Column({ nullable: false })
    public city: string;
  
    @Column({ nullable: false })
    public state: string;
  
    @Column({ nullable: false })
    public zip: string;
  
    @OneToOne(type => Profile, profile => profile.address)
    public profile: Profile;
  }