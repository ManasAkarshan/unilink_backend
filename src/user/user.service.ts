import { Injectable } from '@nestjs/common';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  
    async validateUser(email:string, password:string): Promise<User>{
      return new User
    }
}
