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
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development',
      load:[databaseConfig]
    }),
    TypeOrmModule.forRootAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory:((configService:ConfigService)=>{
        const dbConfig = configService.get('database');
        return {
          type: 'postgres',
          url:dbConfig.url,
          autoLoadEntities: dbConfig.autoLoadEntities,
          synchronize: dbConfig.synchronize,  
          ssl: {
            rejectUnauthorized:false
          }
        };
      })
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
