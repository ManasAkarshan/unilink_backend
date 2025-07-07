import { IsNumber } from "class-validator";
import { Link } from "src/link/entity/link.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User{
  @PrimaryGeneratedColumn()
  @IsNumber()
  id:number

  // Auth fields

  @Column()
  email:string

  @Column()
  password:string

  // detail field
  @Column()
  username:string

  @Column()
  bio:string

  @Column()
  name:string

  @Column()
  profilePic:string

  @OneToMany(()=>Link, (link)=>link.user, {cascade:true})
  links:Link[]


}