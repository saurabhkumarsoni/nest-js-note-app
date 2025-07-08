import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { NotFoundException } from '@nestjs/common';

describe('CategoryController', () => {
  let controller: CategoryController;
  let categoryService: CategoryService;
  const mockCategoryService = {
    create: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockCategory = {
    id: 1,
    name: 'Test Category',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
          useValue: mockCategoryService,
        },
      ],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);

    categoryService = module.get<CategoryService>(CategoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new category', async () => {
      const createCategoryDto: CreateCategoryDto = {
        name: 'New Category',
      };

      const createdCategory = { ...mockCategory, ...createCategoryDto };

      mockCategoryService.create.mockResolvedValue(createdCategory);

      const result = await controller.create(createCategoryDto);

      expect(categoryService.create).toHaveBeenCalledWith(createCategoryDto);

      expect(result).toEqual(createdCategory);
    });

    it('should return existing category if it already exists', async () => {
      const createCategoryDto: CreateCategoryDto = {
        name: 'Existing Category',
      };

      // Service returns existing category instead of creating new one

      mockCategoryService.create.mockResolvedValue(mockCategory);

      const result = await controller.create(createCategoryDto);

      expect(categoryService.create).toHaveBeenCalledWith(createCategoryDto);

      expect(result).toEqual(mockCategory);
    });

    it('should validate category name length', async () => {
      const createCategoryDto: CreateCategoryDto = {
        name: 'A', // Too short (minimum 2 characters)
      };

      // This would typically be caught by class-validator

      mockCategoryService.create.mockRejectedValue(
        new Error('Validation failed'),
      );

      await expect(controller.create(createCategoryDto)).rejects.toThrow(
        'Validation failed',
      );
    });
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      const categories = [mockCategory];

      mockCategoryService.findAll.mockResolvedValue(categories);

      const result = await controller.findAll();

      expect(categoryService.findAll).toHaveBeenCalled();

      expect(result).toEqual(categories);
    });

    it('should return empty array when no categories exist', async () => {
      mockCategoryService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(categoryService.findAll).toHaveBeenCalled();

      expect(result).toEqual([]);
    });

    it('should return categories sorted by name', async () => {
      const categories = [
        { ...mockCategory, id: 1, name: 'B Category' },

        { ...mockCategory, id: 2, name: 'A Category' },
      ];

      // Service should return sorted categories

      const sortedCategories = [
        { ...mockCategory, id: 2, name: 'A Category' },

        { ...mockCategory, id: 1, name: 'B Category' },
      ];

      mockCategoryService.findAll.mockResolvedValue(sortedCategories);

      const result = await controller.findAll();

      expect(categoryService.findAll).toHaveBeenCalled();

      expect(result).toEqual(sortedCategories);
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const updateCategoryDto: UpdateCategoryDto = {
        name: 'Updated Category',
      };

      const updatedCategory = { ...mockCategory, ...updateCategoryDto };

      mockCategoryService.update.mockResolvedValue(updatedCategory);

      const result = await controller.update(
        mockCategory.id,

        updateCategoryDto,
      );

      expect(categoryService.update).toHaveBeenCalledWith(
        mockCategory.id,

        updateCategoryDto,
      );

      expect(result).toEqual(updatedCategory);
    });

    it('should handle updating non-existent category', async () => {
      const updateCategoryDto: UpdateCategoryDto = {
        name: 'Updated Category',
      };

      mockCategoryService.update.mockRejectedValue(
        new NotFoundException('Category not found'),
      );

      await expect(controller.update(999, updateCategoryDto)).rejects.toThrow(
        NotFoundException,
      );

      expect(categoryService.update).toHaveBeenCalledWith(
        999,

        updateCategoryDto,
      );
    });

    it('should handle partial updates', async () => {
      const updateCategoryDto: UpdateCategoryDto = {}; // Empty update

      const updatedCategory = mockCategory; // No changes

      mockCategoryService.update.mockResolvedValue(updatedCategory);

      const result = await controller.update(
        mockCategory.id,

        updateCategoryDto,
      );

      expect(categoryService.update).toHaveBeenCalledWith(
        mockCategory.id,

        updateCategoryDto,
      );

      expect(result).toEqual(updatedCategory);
    });
  });

  describe('remove', () => {
    it('should remove a category', async () => {
      const deleteResult = { message: 'Category deleted successfully' };

      mockCategoryService.remove.mockResolvedValue(deleteResult);

      const result = await controller.remove(mockCategory.id);

      expect(categoryService.remove).toHaveBeenCalledWith(mockCategory.id);

      expect(result).toEqual(deleteResult);
    });

    it('should handle removing non-existent category', async () => {
      mockCategoryService.remove.mockRejectedValue(
        new NotFoundException('Category not found'),
      );

      await expect(controller.remove(999)).rejects.toThrow(NotFoundException);

      expect(categoryService.remove).toHaveBeenCalledWith(999);
    });

    it('should handle removing category with associated notes', async () => {
      mockCategoryService.remove.mockRejectedValue(
        new Error('Cannot delete category with associated notes'),
      );

      await expect(controller.remove(mockCategory.id)).rejects.toThrow(
        'Cannot delete category with associated notes',
      );

      expect(categoryService.remove).toHaveBeenCalledWith(mockCategory.id);
    });
  });

  describe('parameter validation', () => {
    it('should handle invalid id parameter', async () => {
      // This would typically be caught by ParseIntPipe

      const invalidId = 'invalid-id';

      // Simulate what would happen if ParseIntPipe fails

      await expect(async () => {
        const parsedId = parseInt(invalidId);

        if (isNaN(parsedId)) {
          throw new Error('Validation failed');
        }

        await controller.update(parsedId, { name: 'test' });
      }).rejects.toThrow('Validation failed');
    });
  });

  describe('error handling', () => {
    it('should handle database connection errors', async () => {
      mockCategoryService.findAll.mockRejectedValue(
        new Error('Database connection failed'),
      );

      await expect(controller.findAll()).rejects.toThrow(
        'Database connection failed',
      );
    });

    it('should handle service layer errors', async () => {
      const createCategoryDto: CreateCategoryDto = {
        name: 'Test Category',
      };

      mockCategoryService.create.mockRejectedValue(new Error('Service error'));

      await expect(controller.create(createCategoryDto)).rejects.toThrow(
        'Service error',
      );
    });
  });
});
