import { Test, TestingModule } from '@nestjs/testing';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { NotFoundException } from '@nestjs/common';

describe('TagController', () => {
  let controller: TagController;
  let tagService: TagService;

  const mockTagService = {
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockTag = {
    id: 1,
    name: 'Test Tag',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagController],
      providers: [
        {
          provide: TagService,
          useValue: mockTagService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<TagController>(TagController);
    tagService = module.get<TagService>(TagService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all tags', async () => {
      const tags = [mockTag];
      mockTagService.findAll.mockResolvedValue(tags);

      const result = await controller.findAll();

      expect(tagService.findAll).toHaveBeenCalled();
      expect(result).toEqual(tags);
    });

    it('should return empty array when no tags exist', async () => {
      mockTagService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(tagService.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('create', () => {
    it('should create a new tag', async () => {
      const createTagDto: CreateTagDto = {
        name: 'New Tag',
      };

      const createdTag = { ...mockTag, ...createTagDto };
      mockTagService.create.mockResolvedValue(createdTag);

      const result = await controller.create(createTagDto);

      expect(tagService.create).toHaveBeenCalledWith(createTagDto);
      expect(result).toEqual(createdTag);
    });

    it('should handle duplicate tag creation', async () => {
      const createTagDto: CreateTagDto = {
        name: 'Existing Tag',
      };

      mockTagService.create.mockRejectedValue(new Error('Tag already exists'));

      await expect(controller.create(createTagDto)).rejects.toThrow('Tag already exists');
      expect(tagService.create).toHaveBeenCalledWith(createTagDto);
    });
  });

  describe('update', () => {
    it('should update a tag', async () => {
      const updateTagDto: UpdateTagDto = {
        name: 'Updated Tag',
      };

      const updatedTag = { ...mockTag, ...updateTagDto };
      mockTagService.update.mockResolvedValue(updatedTag);

      const result = await controller.update(mockTag.id, updateTagDto);

      expect(tagService.update).toHaveBeenCalledWith(mockTag.id, updateTagDto);
      expect(result).toEqual(updatedTag);
    });

    it('should handle updating non-existent tag', async () => {
      const updateTagDto: UpdateTagDto = {
        name: 'Updated Tag',
      };

      mockTagService.update.mockRejectedValue(new NotFoundException('Tag not found'));

      await expect(controller.update(999, updateTagDto)).rejects.toThrow(NotFoundException);
      expect(tagService.update).toHaveBeenCalledWith(999, updateTagDto);
    });
  });

  describe('remove', () => {
    it('should remove a tag', async () => {
      const deleteResult = { message: 'Tag deleted successfully' };
      mockTagService.remove.mockResolvedValue(deleteResult);

      const result = await controller.remove(mockTag.id);

      expect(tagService.remove).toHaveBeenCalledWith(mockTag.id);
      expect(result).toEqual(deleteResult);
    });

    it('should handle removing non-existent tag', async () => {
      mockTagService.remove.mockRejectedValue(new NotFoundException('Tag not found'));

      await expect(controller.remove(999)).rejects.toThrow(NotFoundException);
      expect(tagService.remove).toHaveBeenCalledWith(999);
    });
  });
});
