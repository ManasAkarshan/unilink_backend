// src/seed/seed.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedCommand } from './seed.command';
import { User } from '../user/entity/user.entity';
import { Link } from '../link/entity/link.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Link, ])],
  providers: [SeedCommand],
})
export class SeedModule {}
