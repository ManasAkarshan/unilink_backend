import { Module } from '@nestjs/common';
import { LinkController } from './link.controller';
import { LinkService } from './link.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from './entity/link.entity';

@Module({
  controllers: [LinkController],
  providers: [LinkService],
  imports:[
    TypeOrmModule.forFeature([Link])
  ]
})
export class LinkModule {}
