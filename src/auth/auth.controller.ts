import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Logger, Post, Res, UnauthorizedException } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginResponse } from './dto/login-response.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name)
  constructor(private readonly authService: AuthService, private readonly userService:UserService){}

  @ApiOperation({summary: 'Login user', description:'Fetch user, validate credential and then return access token and set refresh token to cookie'})
  @ApiBody({type:LoginUserDto})
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    type: LoginResponse,
  })
  @ApiBadRequestResponse({description: 'Invalid credential'})
  @HttpCode(200)
  @Post('login')
  async login(@Body() loginUserDto:LoginUserDto, @Res({passthrough:true}) res:Response): Promise<LoginResponse>{
    try {
    // populate cookie using res.cookie('refreshToken', rt, {})
    const data:LoginResponse =  await this.authService.login(loginUserDto)

    // ✅ Set refresh token in HttpOnly cookie
    res.cookie('refreshToken', data.body.refreshToken, {
      httpOnly: true,
      secure: true,           // Use only over HTTPS
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return data
    } catch (error) {
      this.logger.error("Something went wrong: ", error)
      throw new BadRequestException("Something went wrong: ", error)
    }
    
  }

  @ApiOperation({summary: 'Signup user', description:'Add the user data in the db'})
  @ApiBody({type:CreateUserDto})
  @ApiResponse({
    status: 201,
    description: 'User successfully created',
    type: CreateUserDto,
  })
  @ApiBadRequestResponse({description: 'Something went wrong'})
  @HttpCode(201)
  @Post('signup')
  signUp(){
    try {
      
    } catch (error) {
      this.logger.error("Something went wrong: ", error)
      throw new BadRequestException("Something went wrong: ", error)
    }
  }

  @Post('refresh')
  refresh(){

  }
}
