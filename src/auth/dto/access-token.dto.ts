import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/user/entity/user.entity";

export class AccessTokenDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken:string

  @ApiProperty()
  user?:{
    id:number,
    username:string,
    email:string
  }
}