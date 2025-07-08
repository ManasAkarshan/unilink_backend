import { BadRequestException, HttpException, HttpStatus, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name)
  constructor(@InjectRepository(User) private readonly userRepository:Repository<User>){}
  
    async validateUser(email:string, password:string): Promise<User>{
      try {
        const user = await this.userRepository.findOne({
          where:{email}
        })

        if(!user){
          throw new NotFoundException('User with given credential do not exist')
        }

        if(await bcrypt.compare(password, user.password)){
          return user
        }else{
          throw new UnauthorizedException('Invalid password')
        }
      } catch (error) {
        this.logger.error('Some error occurred', error)
        throw error
      }
    }
}
