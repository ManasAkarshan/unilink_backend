import { IsEmail, IsString, MinLength } from "class-validator"

export class CreateUserDto{
  @IsString()
  @IsEmail()
  email:string

  @IsString()
  @MinLength(3, {message:"Username should be minimum 8 characters long"})
  username: string

  @IsString()
  @MinLength(8, {message:"Password should be minimum 8 characters long"})
  password:string
}