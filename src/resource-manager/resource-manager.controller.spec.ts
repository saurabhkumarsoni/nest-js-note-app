import { Test, TestingModule } from '@nestjs/testing';
import { ResourceManagerController } from './resource-manager.controller';

describe('ResourceManagerController', () => {
  let controller: ResourceManagerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResourceManagerController],
    }).compile();

    controller = module.get<ResourceManagerController>(
      ResourceManagerController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
