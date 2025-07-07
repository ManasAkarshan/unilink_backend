import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginResponse } from './dto/login-response.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { UserService } from 'src/user/user.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {

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
    const user= await this.userService.validateUser(loginUserDto.email, loginUserDto.password)
    const some = await this.authService.login(loginUserDto)

    // populate cookie using res.cookie('refreshToken', rt, {})

    return some
  }

  @Post('signup')
  signUp(){

  }

  @Post('refresh')
  refresh(){

  }
}
