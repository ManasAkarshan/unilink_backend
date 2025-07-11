import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginResponse } from './dto/login-response.dto';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AccessTokenDto } from './dto/access-token.dto';
import { SignUpResponse } from './dto/signup-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @ApiOperation({
    summary: 'Login user',
    description:
      'Fetch user, validate credential and then return access token and set refresh token to cookie',
  })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    type: LoginResponse,
  })
  @ApiBadRequestResponse({ description: 'Invalid credential' })
  @HttpCode(200)
  @Post('login')
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponse> {
    try {
      // populate cookie using res.cookie('refreshToken', rt, {})
      const data: LoginResponse = await this.authService.login(loginUserDto);

      // ✅ Set refresh token in HttpOnly cookie
      res.cookie('refreshToken', data.body.refreshToken, {
        httpOnly: true,
        secure: true, // Use only over HTTPS
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      return data;
    } catch (error) {
      this.logger.error('Something went wrong: ', error);
      if(error instanceof HttpException){
        throw error
      }
      throw new BadRequestException(`${error}`);
    }
  }

  @ApiOperation({
    summary: 'Signup user',
    description: 'Add the user data in the db',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully created',
    type: CreateUserDto,
  })
  @ApiBadRequestResponse({ description: 'Something went wrong' })
  @HttpCode(201)
  @Post('signup')
  signUp(@Body() createUserDto: CreateUserDto): Promise<SignUpResponse> {
    try {
      return this.authService.signup(createUserDto);
    } catch (error) {
      this.logger.error('Something went wrong: ', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException(`${error}`);
    }
  }

  @ApiOperation({
    summary: 'Verify and create auth tokens',
    description: 'Verify refresh token and generate access token',
  })
  @ApiBody({ })
  @ApiResponse({
    status: 200,
    description: 'Tokens verified and created',
    type: AccessTokenDto,
  })
  @ApiUnauthorizedResponse({
    description:"Token missing or invalid"
  })
  @HttpCode(200)
  @Post('refresh')
  async refresh(@Req() req: Request, @Res({passthrough:true}) res:Response) :Promise<AccessTokenDto> {
    try {
      const refreshToken = req.cookies?.refreshToken
      if(!refreshToken){
        throw new UnauthorizedException("No refresh token found")
      }
      const {accessToken} = await this.authService.refreshAccessToken(refreshToken)

     return {accessToken}

    } catch (error) {
      this.logger.error('Something went wrong: ', error);
      if(error instanceof UnauthorizedException){
        throw error
      }
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
