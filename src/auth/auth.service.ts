import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { LoginResponse } from './dto/login-response.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AuthService {

  private readonly logger = new Logger(AuthService.name)
  constructor(private readonly userService:UserService,private readonly jwtService:JwtService, private readonly configService:ConfigService){}

  async login(loginUserDto:LoginUserDto): Promise<LoginResponse>{
    try {
      const user : User | null = await this.userService.validateUser(loginUserDto.email, loginUserDto.password)
      if(!user){
        throw new UnauthorizedException("Invalid credential")
      }

      const payload = { sub: user.id, username: user.email };
      const accessToken = await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '7d'
      })
      const d = this.configService.get<string>('JWT_SECRET');
      console.log(d);
      const refreshToken = await this.jwtService.signAsync(payload, { 
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '1h'
      })

      this.logger.log(refreshToken, accessToken, user)

      return {
        code:1,
        message:"Login successful",
        body:{
          accessToken:accessToken,
          refreshToken:refreshToken,
          user:{
            id:user.id,
            username:user.username,
            email:user.email
          }
        }
    }
    } catch (error) {
      this.logger.error("Something went wrong: ", error)
      throw error
    }
  }

}
