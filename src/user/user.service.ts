import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  EntityManager,
  QueryFailedError,
  Repository,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { SignUpResponse } from 'src/auth/dto/signup-response.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
      });

      if (!user) {
        throw new NotFoundException('User with given email do not exist');
      }

      if (await bcrypt.compare(password, user.password)) {
        return user;
      } else {
        throw new BadRequestException('Invalid password');
      }
    } catch (error) {
      this.logger.error('Some error occurred', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException(`${error}`);
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<SignUpResponse> {
    try {
      return await this.dataSource.transaction(
        async (manager: EntityManager) => {
          const salt = await bcrypt.genSalt();
          const hashedPass = await bcrypt.hash(createUserDto.password, salt);
          const user = manager.create(User, {
            username: createUserDto.username,
            password: hashedPass,
            email: createUserDto.email,
          });

          const createdUser = await manager.save(User, user);

          return {
            code: 2,
            message: 'User created successfully',
            body: {
              user: createdUser,
            },
          };
        },
      );
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error as any).code === '23505'
      ) {
        if ((error as any).detail?.includes('username')) {
          throw new BadRequestException('Username already exists');
        } else if ((error as any).detail?.includes('email')) {
          throw new BadRequestException('Email already exists');
        }
        throw new BadRequestException('Duplicate entry');
      }
      throw new BadRequestException(`${error}`);
    }
  }

  async findUserById(id: number) {
    try {
      const user = await this.userRepository.findOneBy({
        id,
      });
      return user;
    } catch (error) {
      this.logger.error('Something went wrong: ', error);
      throw error;
    }
  }
}
