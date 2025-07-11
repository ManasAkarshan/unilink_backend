import {
  BadRequestException,
  HttpException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginResponse } from './dto/login-response.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';
import { SignUpResponse } from './dto/signup-response.dto';
import { AccessTokenDto } from './dto/access-token.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginUserDto: LoginUserDto): Promise<LoginResponse> {
    try {
      this.logger.log('Login email: ', loginUserDto.email);
      const user = await this.userService.validateUser(
        loginUserDto.email,
        loginUserDto.password,
      );
      if (!user) {
        throw new BadRequestException('Invalid credential');
      }

      const payload = { sub: user.id, username: user.email };
      const accessToken = await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>(
          'JWT_ACCESS_TOKEN_EXPIRES_IN',
        ),
      });
      const refreshToken = await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>(
          'JWT_REFRESH_TOKEN_EXPIRES_IN',
        ),
      });

      this.logger.log(refreshToken, accessToken, user);

      return {
        code: 1,
        message: 'Login successful',
        body: {
          accessToken: accessToken,
          refreshToken: refreshToken,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
          },
        },
      };
    } catch (error) {
      this.logger.error('Something went wrong: ', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException(`${error}`);
    }
  }

  async signup(createUserDto: CreateUserDto): Promise<SignUpResponse> {
    try {
      return this.userService.createUser(createUserDto);
    } catch (error) {
      this.logger.error('Something went wrong: ', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException(`${error}`);
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<AccessTokenDto> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      const newPayload = {
        sub: payload.sub,
        username: payload.username,
      };

      const dbUser = await this.userService.findUserById(payload.sub);

      if (!dbUser) {
        throw new UnauthorizedException('User do not exist');
      }

      const accessToken = await this.jwtService.signAsync(newPayload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRES_IN'),
      });

      this.logger.log(`New access token generated`)

      return {
        accessToken,
        user: { 
          id: dbUser.id, 
          email: dbUser.email, 
          username: dbUser.username 
        },
      };
    } catch (error) {
      this.logger.error('Something went wrong: ', error);
      if(error instanceof UnauthorizedException){
        throw error
      }
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
