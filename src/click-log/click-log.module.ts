import { Module } from '@nestjs/common';
import { ClickLogService } from './click-log.service';
import { ClickLogController } from './click-log.controller';

@Module({
  providers: [ClickLogService],
  controllers: [ClickLogController]
})
export class ClickLogModule {}
