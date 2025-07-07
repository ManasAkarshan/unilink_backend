import { Injectable, Logger } from '@nestjs/common';
import { LoginResponse } from './dto/login-response.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from 'src/user/entity/user.entity';

@Injectable()
export class AuthService {

  private readonly logger = new Logger(AuthService.name)


  async login(loginUserDto:LoginUserDto): Promise<LoginResponse>{
    return {
      code:1,
      message:"",
      body:{
        accessToken:""
      }
    }
  }
}
