import { Test, TestingModule } from '@nestjs/testing';
import { ClickLogController } from './click-log.controller';

describe('ClickLogController', () => {
  let controller: ClickLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClickLogController],
    }).compile();

    controller = module.get<ClickLogController>(ClickLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
