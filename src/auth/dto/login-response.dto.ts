import { ApiProperty } from "@nestjs/swagger"
import { AccessTokenDto } from "src/auth/dto/access-token.dto"


export class LoginResponse {
  @ApiProperty()
  code:number

  @ApiProperty()
  message:string

  @ApiProperty()
  body:AccessTokenDto
}

