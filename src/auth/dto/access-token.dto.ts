import { ApiProperty } from "@nestjs/swagger";

export class AccessTokenDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken?:string

  @ApiProperty()
  user?:{
    id:number,
    username:string,
    email:string
  }
}