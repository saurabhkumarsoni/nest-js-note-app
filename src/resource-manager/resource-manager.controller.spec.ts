import { Test, TestingModule } from '@nestjs/testing';
import { ResourceManagerController } from './resource-manager.controller';
import { ResourceManagerService } from './resource-manager.service';
import { CreateResourceManagerDto } from './dto/create-resource-manager.dto';
import { UpdateResourceManagerDto } from './dto/update-resource-manager.dto';
import { NotFoundException } from '@nestjs/common';
import { ParseUUIDPipe } from '@nestjs/common';

describe('ResourceManagerController', () => {
  let controller: ResourceManagerController;
  let resourceManagerService: ResourceManagerService;

  const mockResourceManagerService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockResourceManager = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'John Doe',
    position: 'Senior Manager',
    project: 'Project Alpha',
    image: 'https://example.com/image.jpg',
    reportsToId: '456e7890-e89b-12d3-a456-426614174000',
    repartees: [
      {
        id: '789e0123-e89b-12d3-a456-426614174000',
        name: 'Jane Smith',
        position: 'Developer',
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepartees = [
    {
      id: '789e0123-e89b-12d3-a456-426614174000',
      name: 'Jane Smith',
      position: 'Developer',
    },
    {
      id: '012e3456-e89b-12d3-a456-426614174000',
      name: 'Bob Johnson',
      position: 'Designer',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResourceManagerController],
      providers: [
        {
          provide: ResourceManagerService,
          useValue: mockResourceManagerService,
        },
      ],
    }).compile();

    controller = module.get<ResourceManagerController>(
      ResourceManagerController,
    );
    resourceManagerService = module.get<ResourceManagerService>(
      ResourceManagerService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all resource managers', async () => {
      const resourceManagers = [mockResourceManager];
      mockResourceManagerService.findAll.mockResolvedValue(resourceManagers);

      const result = await controller.findAll();

      expect(resourceManagerService.findAll).toHaveBeenCalled();
      expect(result).toEqual(resourceManagers);
    });

    it('should return empty array when no resource managers exist', async () => {
      mockResourceManagerService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(resourceManagerService.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('should handle service errors', async () => {
      mockResourceManagerService.findAll.mockRejectedValue(
        new Error('Service error'),
      );

      await expect(controller.findAll()).rejects.toThrow('Service error');
    });
  });

  describe('findOne', () => {
    it('should return a resource manager by id', async () => {
      mockResourceManagerService.findOne.mockResolvedValue(mockResourceManager);

      const result = await controller.findOne(mockResourceManager.id);

      expect(resourceManagerService.findOne).toHaveBeenCalledWith(
        mockResourceManager.id,
      );
      expect(result).toEqual(mockResourceManager);
    });

    it('should handle resource manager not found', async () => {
      mockResourceManagerService.findOne.mockRejectedValue(
        new NotFoundException('Resource manager not found'),
      );

      await expect(controller.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should validate UUID format', async () => {
      // This would be handled by ParseUUIDPipe in real scenario
      const invalidId = 'invalid-uuid';

      // Simulate ParseUUIDPipe validation
      const parseUUIDPipe = new ParseUUIDPipe();
      await expect(
        parseUUIDPipe.transform(invalidId, { type: 'param' }),
      ).rejects.toThrow();
    });
  });

  describe('create', () => {
    it('should create a new resource manager', async () => {
      const createResourceManagerDto: CreateResourceManagerDto = {
        name: 'New Manager',
        position: 'Manager',
        project: 'Project Beta',
        image: 'https://example.com/new-image.jpg',
        reportsToId: '456e7890-e89b-12d3-a456-426614174000',
      };

      const createdResourceManager = {
        ...mockResourceManager,
        ...createResourceManagerDto,
      };
      mockResourceManagerService.create.mockResolvedValue(
        createdResourceManager,
      );

      const result = await controller.create(createResourceManagerDto);

      expect(resourceManagerService.create).toHaveBeenCalledWith(
        createResourceManagerDto,
      );
      expect(result).toEqual(createdResourceManager);
    });

    it('should handle creation with minimal data', async () => {
      const createResourceManagerDto: CreateResourceManagerDto = {
        name: 'Minimal Manager',
        position: 'Manager',
        project: 'Project Gamma',
      };

      const createdResourceManager = {
        ...mockResourceManager,
        ...createResourceManagerDto,
      };
      mockResourceManagerService.create.mockResolvedValue(
        createdResourceManager,
      );

      const result = await controller.create(createResourceManagerDto);

      expect(resourceManagerService.create).toHaveBeenCalledWith(
        createResourceManagerDto,
      );
      expect(result).toEqual(createdResourceManager);
    });

    it('should handle creation errors', async () => {
      const createResourceManagerDto: CreateResourceManagerDto = {
        name: 'Error Manager',
        position: 'Manager',
        project: 'Project Delta',
      };

      mockResourceManagerService.create.mockRejectedValue(
        new Error('Creation failed'),
      );

      await expect(controller.create(createResourceManagerDto)).rejects.toThrow(
        'Creation failed',
      );
    });
  });

  describe('update', () => {
    it('should update a resource manager', async () => {
      const updateResourceManagerDto: UpdateResourceManagerDto = {
        name: 'Updated Manager',
        position: 'Senior Manager',
      };

      const updatedResourceManager = {
        ...mockResourceManager,
        ...updateResourceManagerDto,
      };
      mockResourceManagerService.update.mockResolvedValue(
        updatedResourceManager,
      );

      const result = await controller.update(
        mockResourceManager.id,
        updateResourceManagerDto,
      );

      expect(resourceManagerService.update).toHaveBeenCalledWith(
        mockResourceManager.id,
        updateResourceManagerDto,
      );
      expect(result).toEqual(updatedResourceManager);
    });

    it('should handle partial updates', async () => {
      const updateResourceManagerDto: UpdateResourceManagerDto = {
        position: 'Lead Manager',
      };

      const updatedResourceManager = {
        ...mockResourceManager,
        ...updateResourceManagerDto,
      };
      mockResourceManagerService.update.mockResolvedValue(
        updatedResourceManager,
      );

      const result = await controller.update(
        mockResourceManager.id,
        updateResourceManagerDto,
      );

      expect(resourceManagerService.update).toHaveBeenCalledWith(
        mockResourceManager.id,
        updateResourceManagerDto,
      );
      expect(result).toEqual(updatedResourceManager);
    });

    it('should handle updating non-existent resource manager', async () => {
      const updateResourceManagerDto: UpdateResourceManagerDto = {
        name: 'Updated Manager',
      };

      mockResourceManagerService.update.mockRejectedValue(
        new NotFoundException('Resource manager not found'),
      );

      await expect(
        controller.update('non-existent-id', updateResourceManagerDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a resource manager', async () => {
      const deleteResult = { message: 'Resource manager deleted successfully' };
      mockResourceManagerService.remove.mockResolvedValue(deleteResult);

      const result = await controller.remove(mockResourceManager.id);

      expect(resourceManagerService.remove).toHaveBeenCalledWith(
        mockResourceManager.id,
      );
      expect(result).toEqual(deleteResult);
    });

    it('should handle removing non-existent resource manager', async () => {
      mockResourceManagerService.remove.mockRejectedValue(
        new NotFoundException('Resource manager not found'),
      );

      await expect(controller.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle removal errors', async () => {
      mockResourceManagerService.remove.mockRejectedValue(
        new Error('Cannot delete resource manager with active reports'),
      );

      await expect(controller.remove(mockResourceManager.id)).rejects.toThrow(
        'Cannot delete resource manager with active reports',
      );
    });
  });

  describe('getRepartees', () => {
    it('should return repartees for a resource manager', async () => {
      const managerWithRepartees = {
        ...mockResourceManager,
        repartees: mockRepartees,
      };
      mockResourceManagerService.findOne.mockResolvedValue(
        managerWithRepartees,
      );

      const result = await controller.getRepartees(mockResourceManager.id);

      expect(resourceManagerService.findOne).toHaveBeenCalledWith(
        mockResourceManager.id,
      );
      expect(result).toEqual(mockRepartees);
    });

    it('should return empty array when manager has no repartees', async () => {
      const managerWithoutRepartees = { ...mockResourceManager, repartees: [] };
      mockResourceManagerService.findOne.mockResolvedValue(
        managerWithoutRepartees,
      );

      const result = await controller.getRepartees(mockResourceManager.id);

      expect(resourceManagerService.findOne).toHaveBeenCalledWith(
        mockResourceManager.id,
      );
      expect(result).toEqual([]);
    });

    it('should handle manager not found when getting repartees', async () => {
      mockResourceManagerService.findOne.mockRejectedValue(
        new NotFoundException('Resource manager not found'),
      );

      await expect(controller.getRepartees('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should validate UUID format for getRepartees', async () => {
      const invalidId = 'invalid-uuid';

      // Simulate ParseUUIDPipe validation
      const parseUUIDPipe = new ParseUUIDPipe();
      await expect(
        parseUUIDPipe.transform(invalidId, { type: 'param' }),
      ).rejects.toThrow();
    });
  });

  describe('error handling', () => {
    it('should handle database connection errors', async () => {
      mockResourceManagerService.findAll.mockRejectedValue(
        new Error('Database connection failed'),
      );

      await expect(controller.findAll()).rejects.toThrow(
        'Database connection failed',
      );
    });

    it('should handle validation errors', async () => {
      const invalidDto: CreateResourceManagerDto = {
        name: '', // Invalid empty name
        position: 'Manager',
        project: 'Project Epsilon',
      };

      mockResourceManagerService.create.mockRejectedValue(
        new Error('Validation failed'),
      );

      await expect(controller.create(invalidDto)).rejects.toThrow(
        'Validation failed',
      );
    });
  });
});
