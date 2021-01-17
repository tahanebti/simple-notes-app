import { BeforeInsert, BeforeUpdate, Column, PrimaryGeneratedColumn } from "typeorm";

export abstract class BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'created_at', nullable: false, type: 'timestamp' })
    public createdAt: Date;

    @Column({ name: 'updated_at', nullable: false, type: 'timestamp' })
    public updatedAt: Date;
  
    @Column({ name: 'deleted_at', nullable: true, type: 'timestamp' })
    public deletedAt: Date;


    @BeforeInsert()
    public beforeInsert() {
      const now: Date = new Date()
      this.createdAt = now;
      this.updatedAt = now;
    }
  
    @BeforeUpdate()
    public BeforeUpdate() {
      const now: Date = new Date();
      this.updatedAt = now;
    }

}