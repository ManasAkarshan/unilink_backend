import { User } from "src/user/entity/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Link{
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title:string

  @Column()
  slug:string

  @Column()
  url:string

  @Column()
  order:string

  @Column()
  icon:string
  
  @ManyToOne(()=>User, (user)=>user.links, {onDelete:'CASCADE'}) // many links can be of one user
  user:User

  @Column()
  isActive:boolean

  @CreateDateColumn()
  createdAt:Date

  @UpdateDateColumn()
  updatedAt:Date

  @DeleteDateColumn()
  deletedAt:Date
}