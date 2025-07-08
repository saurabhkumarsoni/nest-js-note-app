import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResourceManagerService } from './resource-manager.service';
import { ResourceManager } from './entities/resource-manager.entity';

describe('ResourceManagerService', () => {
  let service: ResourceManagerService;
  let repository: Repository<ResourceManager>;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResourceManagerService,
        {
          provide: getRepositoryToken(ResourceManager),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ResourceManagerService>(ResourceManagerService);
    repository = module.get<Repository<ResourceManager>>(
      getRepositoryToken(ResourceManager),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
