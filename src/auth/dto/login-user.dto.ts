import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class LoginUserDto{
  @ApiProperty()
  @IsEmail()
  email:string
  
  @ApiProperty()
  @IsString()
  @MinLength(8,{message:"Password should be at least 8 character long"})
  password:string
}