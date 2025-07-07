import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  private readonly logger = new Logger(AppController.name)

  @Get()
  getHello(): string {
    this.logger.log("App running...")
    return this.appService.getHello();
  }
}
