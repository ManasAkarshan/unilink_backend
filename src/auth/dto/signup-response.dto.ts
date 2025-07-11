import { User } from "src/user/entity/user.entity"

export class SignUpResponse{
  code:number
  message:string
  body:{
    user: User
  }
}