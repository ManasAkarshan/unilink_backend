import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Command, CommandRunner } from "nest-commander";
import { User } from "../user/entity/user.entity";
import { Repository } from "typeorm";

@Injectable()
@Command({
  name:'seed',
  description:'Seed the database with initial data',
})
export class SeedCommand extends CommandRunner{
  constructor(@InjectRepository(User) private readonly userRepository:Repository<User>){
    super();
  }

  async run(): Promise<void> {
    console.log('🌱 Seeding users...')
    const user = new User()
    user.email = 'test@example.com';
    user.password = 'test123'; // In production, use proper password hashing
    user.username = 'manas';
    await this.userRepository.save(user)
    console.log('🌱 Users seeded successfully')
  }
} 