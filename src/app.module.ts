import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { LinkModule } from './link/link.module';
import { ClickLogModule } from './click-log/click-log.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load:[databaseConfig]
    }),
    TypeOrmModule.forRootAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory:((configService:ConfigService)=>({
        type:'postgres',
        url: configService.get('database.url'),
        autoLoadEntities:configService.get('database.autoLoadEntities'),
        synchronize:configService.get('database.synchronize'),
        ssl:{
          rejectUnauthorized:false
        }
      }))
    }),
    AuthModule,
    UserModule,
    LinkModule,
    ClickLogModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
