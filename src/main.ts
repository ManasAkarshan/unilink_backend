import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {AddressInfo} from 'net'
import { AllExceptionFilter } from './common/filters/all-exception.filter';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Web App')

  app.useGlobalPipes(
    new ValidationPipe(
      {
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }
    )
  )

  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })

  // app.setGlobalPrefix('/api/v1')

  // app.useGlobalFilters(new AllExceptionFilter())

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))
  app.use(cookieParser())

  const config = new DocumentBuilder().setTitle('Unilink app')
    .setDescription('The unilink API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document)

  await app.listen(process.env.PORT ?? 3000)
    .then((server)=>{
      const address = server.address() as AddressInfo;
      const host =
        address.address === '::' || address.address === '0.0.0.0'
          ? 'localhost'
          : address.address;

      logger.log(`Started web app at http://${host}:${address.port}`);
      logger.log(`Swagger docs available at http://${host}:${address.port}/docs`);
    }).catch((error)=>{
      logger.error("Error starting we app ", error)
    })
}
bootstrap();

