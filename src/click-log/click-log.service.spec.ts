import { Test, TestingModule } from '@nestjs/testing';
import { ClickLogService } from './click-log.service';

describe('ClickLogService', () => {
  let service: ClickLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClickLogService],
    }).compile();

    service = module.get<ClickLogService>(ClickLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
