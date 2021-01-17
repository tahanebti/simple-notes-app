import { BaseEntity } from "src/database/base.entity";
import { Plan } from "src/plans/entities/plan.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, Generated, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { Profile } from "./profile.entity";

@Entity()
export class Account extends BaseEntity{

    @Column({ name: 'is_confirmed', default: false })
    public isConfirmed: boolean;

    @Column({ name: 'confirmation_token', nullable: false})
    @Generated('uuid')
    public comfirmationToken: string;

    @OneToOne(type => User, user => user.account)
    public user: User;

    @OneToOne(type => Profile, profile => profile.account)
    public profile: Profile;

    @ManyToOne(type => Plan, plan => plan.accounts, { nullable: false })
    @JoinColumn({ name: 'plan_id' })
    public plan: Plan;

}