import { Exclude, Expose } from "class-transformer";
import { IsNumber } from "class-validator";
import { Link } from "src/link/entity/link.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User{
  @PrimaryGeneratedColumn()
  @IsNumber()
  id:number

  // Auth fields

  @Column({unique:true})
  email:string

  @Column()
  @Exclude()
  password:string

  // detail field
  @Column({unique:true})
  username:string

  @Column({nullable:true})
  bio:string

  @Column({default:false, nullable:true})
  isEmailVerified:boolean

  @Column({nullable:true})
  name:string

  @Column({nullable:true})
  profilePic:string

  @OneToMany(()=>Link, (link)=>link.user, {cascade:true})
  links:Link[]


}