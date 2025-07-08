import { Test, TestingModule } from '@nestjs/testing';

import { StaticDataController } from './static-data.controller';

import { StaticDataService } from './static-data.service';

describe('StaticDataController', () => {
  let controller: StaticDataController;

  let staticDataService: StaticDataService;

  const mockStaticDataService = {
    getPositions: jest.fn(),

    getDepartments: jest.fn(),

    getDegrees: jest.fn(),

    getUniversities: jest.fn(),

    getManagers: jest.fn(),
  };

  const mockPositions = [
    { id: 1, name: 'Software Engineer' },

    { id: 2, name: 'Senior Software Engineer' },

    { id: 3, name: 'Tech Lead' },

    { id: 4, name: 'Engineering Manager' },
  ];

  const mockDepartments = [
    { id: 1, name: 'Engineering' },

    { id: 2, name: 'Product' },

    { id: 3, name: 'Design' },

    { id: 4, name: 'Marketing' },
  ];

  const mockDegrees = [
    { id: 1, name: 'Bachelor of Science' },

    { id: 2, name: 'Master of Science' },

    { id: 3, name: 'Bachelor of Engineering' },

    { id: 4, name: 'Master of Business Administration' },
  ];

  const mockUniversities = [
    { id: 1, name: 'Stanford University' },

    { id: 2, name: 'MIT' },

    { id: 3, name: 'Harvard University' },

    { id: 4, name: 'UC Berkeley' },
  ];

  const mockManagers = [
    { id: 1, name: 'John Smith', position: 'Engineering Manager' },

    { id: 2, name: 'Jane Doe', position: 'Product Manager' },

    { id: 3, name: 'Bob Johnson', position: 'Design Manager' },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StaticDataController],

      providers: [
        {
          provide: StaticDataService,

          useValue: mockStaticDataService,
        },
      ],
    }).compile();

    controller = module.get<StaticDataController>(StaticDataController);

    staticDataService = module.get<StaticDataService>(StaticDataService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getPositions', () => {
    it('should return all positions', async () => {
      mockStaticDataService.getPositions.mockResolvedValue(mockPositions);

      const result = await controller.getPositions();

      expect(staticDataService.getPositions).toHaveBeenCalled();

      expect(result).toEqual(mockPositions);
    });

    it('should return empty array when no positions exist', async () => {
      mockStaticDataService.getPositions.mockResolvedValue([]);

      const result = await controller.getPositions();

      expect(staticDataService.getPositions).toHaveBeenCalled();

      expect(result).toEqual([]);
    });

    it('should handle service errors', async () => {
      mockStaticDataService.getPositions.mockRejectedValue(
        new Error('Service error'),
      );

      await expect(controller.getPositions()).rejects.toThrow('Service error');

      expect(staticDataService.getPositions).toHaveBeenCalled();
    });
  });

  describe('getDepartments', () => {
    it('should return all departments', async () => {
      mockStaticDataService.getDepartments.mockResolvedValue(mockDepartments);

      const result = await controller.getDepartments();

      expect(staticDataService.getDepartments).toHaveBeenCalled();

      expect(result).toEqual(mockDepartments);
    });

    it('should return empty array when no departments exist', async () => {
      mockStaticDataService.getDepartments.mockResolvedValue([]);

      const result = await controller.getDepartments();

      expect(staticDataService.getDepartments).toHaveBeenCalled();

      expect(result).toEqual([]);
    });

    it('should handle service errors', async () => {
      mockStaticDataService.getDepartments.mockRejectedValue(
        new Error('Service error'),
      );

      await expect(controller.getDepartments()).rejects.toThrow(
        'Service error',
      );

      expect(staticDataService.getDepartments).toHaveBeenCalled();
    });
  });

  describe('getDegrees', () => {
    it('should return all degrees', async () => {
      mockStaticDataService.getDegrees.mockResolvedValue(mockDegrees);

      const result = await controller.getDegrees();

      expect(staticDataService.getDegrees).toHaveBeenCalled();

      expect(result).toEqual(mockDegrees);
    });

    it('should return empty array when no degrees exist', async () => {
      mockStaticDataService.getDegrees.mockResolvedValue([]);

      const result = await controller.getDegrees();

      expect(staticDataService.getDegrees).toHaveBeenCalled();

      expect(result).toEqual([]);
    });

    it('should handle service errors', async () => {
      mockStaticDataService.getDegrees.mockRejectedValue(
        new Error('Service error'),
      );

      await expect(controller.getDegrees()).rejects.toThrow('Service error');

      expect(staticDataService.getDegrees).toHaveBeenCalled();
    });
  });

  describe('getUniversities', () => {
    it('should return all universities', async () => {
      mockStaticDataService.getUniversities.mockResolvedValue(mockUniversities);

      const result = await controller.getUniversities();

      expect(staticDataService.getUniversities).toHaveBeenCalled();

      expect(result).toEqual(mockUniversities);
    });

    it('should return empty array when no universities exist', async () => {
      mockStaticDataService.getUniversities.mockResolvedValue([]);

      const result = await controller.getUniversities();

      expect(staticDataService.getUniversities).toHaveBeenCalled();

      expect(result).toEqual([]);
    });

    it('should handle service errors', async () => {
      mockStaticDataService.getUniversities.mockRejectedValue(
        new Error('Service error'),
      );

      await expect(controller.getUniversities()).rejects.toThrow(
        'Service error',
      );

      expect(staticDataService.getUniversities).toHaveBeenCalled();
    });
  });

  describe('getManagers', () => {
    it('should return all managers', async () => {
      mockStaticDataService.getManagers.mockResolvedValue(mockManagers);

      const result = await controller.getManagers();

      expect(staticDataService.getManagers).toHaveBeenCalled();

      expect(result).toEqual(mockManagers);
    });

    it('should return empty array when no managers exist', async () => {
      mockStaticDataService.getManagers.mockResolvedValue([]);

      const result = await controller.getManagers();

      expect(staticDataService.getManagers).toHaveBeenCalled();

      expect(result).toEqual([]);
    });

    it('should handle service errors', async () => {
      mockStaticDataService.getManagers.mockRejectedValue(
        new Error('Service error'),
      );

      await expect(controller.getManagers()).rejects.toThrow('Service error');

      expect(staticDataService.getManagers).toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should handle database connection errors', async () => {
      mockStaticDataService.getPositions.mockRejectedValue(
        new Error('Database connection failed'),
      );

      await expect(controller.getPositions()).rejects.toThrow(
        'Database connection failed',
      );
    });

    it('should handle timeout errors', async () => {
      mockStaticDataService.getDepartments.mockRejectedValue(
        new Error('Request timeout'),
      );

      await expect(controller.getDepartments()).rejects.toThrow(
        'Request timeout',
      );
    });

    it('should handle unexpected errors', async () => {
      mockStaticDataService.getDegrees.mockRejectedValue(
        new Error('Unexpected error'),
      );

      await expect(controller.getDegrees()).rejects.toThrow('Unexpected error');
    });
  });

  describe('data consistency', () => {
    it('should return consistent data structure for positions', async () => {
      mockStaticDataService.getPositions.mockResolvedValue(mockPositions);

      const result = await controller.getPositions();

      expect(Array.isArray(result)).toBe(true);

      if (result.length > 0) {
        expect(result[0]).toHaveProperty('id');

        expect(result[0]).toHaveProperty('name');
      }
    });

    it('should return consistent data structure for departments', async () => {
      mockStaticDataService.getDepartments.mockResolvedValue(mockDepartments);

      const result = await controller.getDepartments();

      expect(Array.isArray(result)).toBe(true);

      if (result.length > 0) {
        expect(result[0]).toHaveProperty('id');

        expect(result[0]).toHaveProperty('name');
      }
    });

    it('should return consistent data structure for managers', async () => {
      mockStaticDataService.getManagers.mockResolvedValue(mockManagers);

      const result = await controller.getManagers();

      expect(Array.isArray(result)).toBe(true);

      if (result.length > 0) {
        expect(result[0]).toHaveProperty('id');

        expect(result[0]).toHaveProperty('name');

        expect(result[0]).toHaveProperty('position');
      }
    });
  });
});
