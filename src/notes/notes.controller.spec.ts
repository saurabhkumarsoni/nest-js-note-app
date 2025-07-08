import { Test, TestingModule } from '@nestjs/testing';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { ForbiddenException } from '@nestjs/common';
import { NotePriority } from './entities/note.entity';

describe('NotesController', () => {
  let controller: NotesController;
  let notesService: NotesService;

  const mockNotesService = {
    createNote: jest.fn(),
    getUserNotes: jest.fn(),
    findNoteById: jest.fn(),
    updateNote: jest.fn(),
    deleteNote: jest.fn(),
    archiveNote: jest.fn(),
    trashNote: jest.fn(),
    restoreNote: jest.fn(),
  };

  const mockUser = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
  };

  const mockNote = {
    id: '456e7890-e89b-12d3-a456-426614174000',
    name: 'Test Note',
    content: 'Test content',
    userId: mockUser.id,
    isArchived: false,
    isTrashed: false,
    priority: NotePriority.MEDIUM,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRequest = {
    user: mockUser,
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotesController],
      providers: [
        {
          provide: NotesService,
          useValue: mockNotesService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<NotesController>(NotesController);
    notesService = module.get<NotesService>(NotesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new note', async () => {
      const createNoteDto: CreateNoteDto = {
        name: 'Test Note',
        content: 'Test content',
        categoryId: 1,
        tags: ['tag1', 'tag2'],
        isArchived: false,
        isTrashed: false,
        priority: NotePriority.MEDIUM,
      };

      mockNotesService.createNote.mockResolvedValue(mockNote);

      const result = await controller.create(createNoteDto, mockRequest);

      expect(notesService.createNote).toHaveBeenCalledWith(
        mockUser.id,
        createNoteDto,
      );
      expect(result).toEqual(mockNote);
    });
  });

  describe('search', () => {
    it('should search notes with query parameters', async () => {
      const searchParams = {
        search: 'test',
        fromDate: '2023-01-01',
        toDate: '2023-12-31',
        limit: '5',
        page: '1',
        sortBy: 'createdAt' as keyof typeof mockNote,
        order: 'DESC' as 'ASC' | 'DESC',
        filter: 'all' as 'all' | 'archived' | 'trashed',
      };

      const expectedResult = {
        notes: [mockNote],
        total: 1,
        page: 1,
        limit: 5,
      };

      mockNotesService.getUserNotes.mockResolvedValue(expectedResult);

      const result = await controller.search(
        mockRequest,
        searchParams.search,
        searchParams.fromDate,
        searchParams.toDate,
        searchParams.limit,
        searchParams.page,
        searchParams.sortBy,
        searchParams.order,
        searchParams.filter,
      );

      expect(notesService.getUserNotes).toHaveBeenCalledWith({
        userId: mockUser.id,
        search: searchParams.search,
        fromDate: searchParams.fromDate,
        toDate: searchParams.toDate,
        limit: 5,
        page: 1,
        sortBy: searchParams.sortBy,
        order: searchParams.order,
        filter: searchParams.filter,
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should get all user notes with default parameters', async () => {
      const expectedResult = {
        notes: [mockNote],
        total: 1,
        page: 1,
        limit: 10,
      };

      mockNotesService.getUserNotes.mockResolvedValue(expectedResult);

      const result = await controller.findAll(mockRequest);

      expect(notesService.getUserNotes).toHaveBeenCalledWith({
        userId: mockUser.id,
        search: undefined,
        fromDate: undefined,
        toDate: undefined,
        limit: 10,
        page: 1,
        sortBy: undefined,
        order: undefined,
        filter: undefined,
      });
      expect(result).toEqual(expectedResult);
    });

    it('should handle search parameter trimming', async () => {
      const expectedResult = {
        notes: [mockNote],
        total: 1,
        page: 1,
        limit: 10,
      };

      mockNotesService.getUserNotes.mockResolvedValue(expectedResult);

      const result = await controller.findAll(mockRequest, '  test  ');

      expect(notesService.getUserNotes).toHaveBeenCalledWith({
        userId: mockUser.id,
        search: 'test',
        fromDate: undefined,
        toDate: undefined,
        limit: 10,
        page: 1,
        sortBy: undefined,
        order: undefined,
        filter: undefined,
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should get a note by id', async () => {
      mockNotesService.findNoteById.mockResolvedValue(mockNote);

      const result = await controller.findOne(mockNote.id, mockRequest);

      expect(notesService.findNoteById).toHaveBeenCalledWith(mockNote.id);
      expect(result).toEqual(mockNote);
    });

    it('should throw ForbiddenException if user does not own the note', async () => {
      const otherUserNote = { ...mockNote, userId: 'other-user-id' };
      mockNotesService.findNoteById.mockResolvedValue(otherUserNote);

      await expect(
        controller.findOne(mockNote.id, mockRequest),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException if note not found', async () => {
      mockNotesService.findNoteById.mockResolvedValue(null);

      await expect(
        controller.findOne(mockNote.id, mockRequest),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('update', () => {
    it('should update a note', async () => {
      const updateNoteDto: UpdateNoteDto = {
        name: 'Updated Note',
        content: 'Updated content',
      };

      const updatedNote = { ...mockNote, ...updateNoteDto };

      mockNotesService.findNoteById.mockResolvedValue(mockNote);
      mockNotesService.updateNote.mockResolvedValue(updatedNote);

      const result = await controller.update(
        mockNote.id,
        updateNoteDto,
        mockRequest,
      );

      expect(notesService.findNoteById).toHaveBeenCalledWith(mockNote.id);
      expect(notesService.updateNote).toHaveBeenCalledWith(
        mockNote.id,
        updateNoteDto,
      );
      expect(result).toEqual(updatedNote);
    });

    it('should throw ForbiddenException if user does not own the note', async () => {
      const updateNoteDto: UpdateNoteDto = {
        name: 'Updated Note',
      };

      const otherUserNote = { ...mockNote, userId: 'other-user-id' };
      mockNotesService.findNoteById.mockResolvedValue(otherUserNote);

      await expect(
        controller.update(mockNote.id, updateNoteDto, mockRequest),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should delete a note', async () => {
      mockNotesService.deleteNote.mockResolvedValue({
        message: 'Note deleted successfully',
      });

      const result = await controller.remove(mockNote.id, mockRequest);

      expect(notesService.deleteNote).toHaveBeenCalledWith(
        mockNote.id,
        mockUser.id,
      );
      expect(result).toEqual({ message: 'Note deleted successfully' });
    });
  });

  describe('archiveNote', () => {
    it('should archive a note', async () => {
      const archivedNote = { ...mockNote, isArchived: true };
      mockNotesService.archiveNote.mockResolvedValue(archivedNote);

      const result = await controller.archiveNote(mockNote.id);

      expect(notesService.archiveNote).toHaveBeenCalledWith(mockNote.id);
      expect(result).toEqual(archivedNote);
    });
  });

  describe('trashNote', () => {
    it('should trash a note', async () => {
      const trashedNote = { ...mockNote, isTrashed: true };
      mockNotesService.trashNote.mockResolvedValue(trashedNote);

      const result = await controller.trashNote(mockNote.id);

      expect(notesService.trashNote).toHaveBeenCalledWith(mockNote.id);
      expect(result).toEqual(trashedNote);
    });
  });

  describe('restoreNote', () => {
    it('should restore a note from trash', async () => {
      const restoredNote = { ...mockNote, isTrashed: false };
      mockNotesService.restoreNote.mockResolvedValue(restoredNote);

      const result = await controller.restoreNote(mockNote.id);

      expect(notesService.restoreNote).toHaveBeenCalledWith(mockNote.id);
      expect(result).toEqual(restoredNote);
    });
  });

  describe('create', () => {
    it('should create a new note', async () => {
      const createNoteDto: CreateNoteDto = {
        name: 'Test Note',
        content: 'Test content',
        categoryId: 1,
        tags: ['tag1', 'tag2'],
        isArchived: false,
        isTrashed: false,
        priority: NotePriority.MEDIUM,
      };

      mockNotesService.createNote.mockResolvedValue(mockNote);

      const result = await controller.create(createNoteDto, mockRequest);

      expect(notesService.createNote).toHaveBeenCalledWith(
        mockUser.id,
        createNoteDto,
      );
      expect(result).toEqual(mockNote);
    });
  });

  describe('search', () => {
    it('should search notes with query parameters', async () => {
      const searchParams = {
        search: 'test',
        fromDate: '2023-01-01',
        toDate: '2023-12-31',
        limit: '5',
        page: '1',
        sortBy: 'createdAt' as keyof typeof mockNote,
        order: 'DESC' as 'ASC' | 'DESC',
        filter: 'all' as 'all' | 'archived' | 'trashed',
      };

      const expectedResult = {
        notes: [mockNote],
        total: 1,
        page: 1,
        limit: 5,
      };

      mockNotesService.getUserNotes.mockResolvedValue(expectedResult);

      const result = await controller.search(
        mockRequest,
        searchParams.search,
        searchParams.fromDate,
        searchParams.toDate,
        searchParams.limit,
        searchParams.page,
        searchParams.sortBy,
        searchParams.order,
        searchParams.filter,
      );

      expect(notesService.getUserNotes).toHaveBeenCalledWith({
        userId: mockUser.id,
        search: searchParams.search,
        fromDate: searchParams.fromDate,
        toDate: searchParams.toDate,
        limit: 5,
        page: 1,
        sortBy: searchParams.sortBy,
        order: searchParams.order,
        filter: searchParams.filter,
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should get all user notes with default parameters', async () => {
      const expectedResult = {
        notes: [mockNote],
        total: 1,
        page: 1,
        limit: 10,
      };

      mockNotesService.getUserNotes.mockResolvedValue(expectedResult);

      const result = await controller.findAll(mockRequest);

      expect(notesService.getUserNotes).toHaveBeenCalledWith({
        userId: mockUser.id,
        search: undefined,
        fromDate: undefined,
        toDate: undefined,
        limit: 10,
        page: 1,
        sortBy: undefined,
        order: undefined,
        filter: undefined,
      });
      expect(result).toEqual(expectedResult);
    });

    it('should handle search parameter trimming', async () => {
      const expectedResult = {
        notes: [mockNote],
        total: 1,
        page: 1,
        limit: 10,
      };

      mockNotesService.getUserNotes.mockResolvedValue(expectedResult);

      const result = await controller.findAll(mockRequest, '  test  ');

      expect(notesService.getUserNotes).toHaveBeenCalledWith({
        userId: mockUser.id,
        search: 'test',
        fromDate: undefined,
        toDate: undefined,
        limit: 10,
        page: 1,
        sortBy: undefined,
        order: undefined,
        filter: undefined,
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should get a note by id', async () => {
      mockNotesService.findNoteById.mockResolvedValue(mockNote);

      const result = await controller.findOne(mockNote.id, mockRequest);

      expect(notesService.findNoteById).toHaveBeenCalledWith(mockNote.id);
      expect(result).toEqual(mockNote);
    });

    it('should throw ForbiddenException if user does not own the note', async () => {
      const otherUserNote = { ...mockNote, userId: 'other-user-id' };
      mockNotesService.findNoteById.mockResolvedValue(otherUserNote);

      await expect(
        controller.findOne(mockNote.id, mockRequest),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException if note not found', async () => {
      mockNotesService.findNoteById.mockResolvedValue(null);

      await expect(
        controller.findOne(mockNote.id, mockRequest),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('update', () => {
    it('should update a note', async () => {
      const updateNoteDto: UpdateNoteDto = {
        name: 'Updated Note',
        content: 'Updated content',
      };

      const updatedNote = { ...mockNote, ...updateNoteDto };

      mockNotesService.findNoteById.mockResolvedValue(mockNote);
      mockNotesService.updateNote.mockResolvedValue(updatedNote);

      const result = await controller.update(
        mockNote.id,
        updateNoteDto,
        mockRequest,
      );

      expect(notesService.findNoteById).toHaveBeenCalledWith(mockNote.id);
      expect(notesService.updateNote).toHaveBeenCalledWith(
        mockNote.id,
        updateNoteDto,
      );
      expect(result).toEqual(updatedNote);
    });

    it('should throw ForbiddenException if user does not own the note', async () => {
      const updateNoteDto: UpdateNoteDto = {
        name: 'Updated Note',
      };

      const otherUserNote = { ...mockNote, userId: 'other-user-id' };
      mockNotesService.findNoteById.mockResolvedValue(otherUserNote);

      await expect(
        controller.update(mockNote.id, updateNoteDto, mockRequest),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should delete a note', async () => {
      mockNotesService.deleteNote.mockResolvedValue({
        message: 'Note deleted successfully',
      });

      const result = await controller.remove(mockNote.id, mockRequest);

      expect(notesService.deleteNote).toHaveBeenCalledWith(
        mockNote.id,
        mockUser.id,
      );
      expect(result).toEqual({ message: 'Note deleted successfully' });
    });
  });

  describe('archiveNote', () => {
    it('should archive a note', async () => {
      const archivedNote = { ...mockNote, isArchived: true };
      mockNotesService.archiveNote.mockResolvedValue(archivedNote);

      const result = await controller.archiveNote(mockNote.id);

      expect(notesService.archiveNote).toHaveBeenCalledWith(mockNote.id);
      expect(result).toEqual(archivedNote);
    });
  });

  describe('trashNote', () => {
    it('should trash a note', async () => {
      const trashedNote = { ...mockNote, isTrashed: true };
      mockNotesService.trashNote.mockResolvedValue(trashedNote);

      const result = await controller.trashNote(mockNote.id);

      expect(notesService.trashNote).toHaveBeenCalledWith(mockNote.id);
      expect(result).toEqual(trashedNote);
    });
  });

  describe('restoreNote', () => {
    it('should restore a note from trash', async () => {
      const restoredNote = { ...mockNote, isTrashed: false };
      mockNotesService.restoreNote.mockResolvedValue(restoredNote);

      const result = await controller.restoreNote(mockNote.id);

      expect(notesService.restoreNote).toHaveBeenCalledWith(mockNote.id);
      expect(result).toEqual(restoredNote);
    });
  });

  describe('create', () => {
    it('should create a new note', async () => {
      const createNoteDto: CreateNoteDto = {
        name: 'Test Note',
        content: 'Test content',
        categoryId: 1,
        tags: ['tag1', 'tag2'],
        isArchived: false,
        isTrashed: false,
        priority: NotePriority.MEDIUM,
      };

      mockNotesService.createNote.mockResolvedValue(mockNote);

      const result = await controller.create(createNoteDto, mockRequest);

      expect(notesService.createNote).toHaveBeenCalledWith(
        mockUser.id,
        createNoteDto,
      );
      expect(result).toEqual(mockNote);
    });
  });

  describe('search', () => {
    it('should search notes with query parameters', async () => {
      const searchParams = {
        search: 'test',
        fromDate: '2023-01-01',
        toDate: '2023-12-31',
        limit: '5',
        page: '1',
        sortBy: 'createdAt' as keyof typeof mockNote,
        order: 'DESC' as 'ASC' | 'DESC',
        filter: 'all' as 'all' | 'archived' | 'trashed',
      };

      const expectedResult = {
        notes: [mockNote],
        total: 1,
        page: 1,
        limit: 5,
      };

      mockNotesService.getUserNotes.mockResolvedValue(expectedResult);

      const result = await controller.search(
        mockRequest,
        searchParams.search,
        searchParams.fromDate,
        searchParams.toDate,
        searchParams.limit,
        searchParams.page,
        searchParams.sortBy,
        searchParams.order,
        searchParams.filter,
      );

      expect(notesService.getUserNotes).toHaveBeenCalledWith({
        userId: mockUser.id,
        search: searchParams.search,
        fromDate: searchParams.fromDate,
        toDate: searchParams.toDate,
        limit: 5,
        page: 1,
        sortBy: searchParams.sortBy,
        order: searchParams.order,
        filter: searchParams.filter,
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should get all user notes with default parameters', async () => {
      const expectedResult = {
        notes: [mockNote],
        total: 1,
        page: 1,
        limit: 10,
      };

      mockNotesService.getUserNotes.mockResolvedValue(expectedResult);

      const result = await controller.findAll(mockRequest);

      expect(notesService.getUserNotes).toHaveBeenCalledWith({
        userId: mockUser.id,
        search: undefined,
        fromDate: undefined,
        toDate: undefined,
        limit: 10,
        page: 1,
        sortBy: undefined,
        order: undefined,
        filter: undefined,
      });
      expect(result).toEqual(expectedResult);
    });

    it('should handle search parameter trimming', async () => {
      const expectedResult = {
        notes: [mockNote],
        total: 1,
        page: 1,
        limit: 10,
      };

      mockNotesService.getUserNotes.mockResolvedValue(expectedResult);

      const result = await controller.findAll(mockRequest, '  test  ');

      expect(notesService.getUserNotes).toHaveBeenCalledWith({
        userId: mockUser.id,
        search: 'test',
        fromDate: undefined,
        toDate: undefined,
        limit: 10,
        page: 1,
        sortBy: undefined,
        order: undefined,
        filter: undefined,
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should get a note by id', async () => {
      mockNotesService.findNoteById.mockResolvedValue(mockNote);

      const result = await controller.findOne(mockNote.id, mockRequest);

      expect(notesService.findNoteById).toHaveBeenCalledWith(mockNote.id);
      expect(result).toEqual(mockNote);
    });

    it('should throw ForbiddenException if user does not own the note', async () => {
      const otherUserNote = { ...mockNote, userId: 'other-user-id' };
      mockNotesService.findNoteById.mockResolvedValue(otherUserNote);

      await expect(
        controller.findOne(mockNote.id, mockRequest),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException if note not found', async () => {
      mockNotesService.findNoteById.mockResolvedValue(null);

      await expect(
        controller.findOne(mockNote.id, mockRequest),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('update', () => {
    it('should update a note', async () => {
      const updateNoteDto: UpdateNoteDto = {
        name: 'Updated Note',
        content: 'Updated content',
      };

      const updatedNote = { ...mockNote, ...updateNoteDto };

      mockNotesService.findNoteById.mockResolvedValue(mockNote);
      mockNotesService.updateNote.mockResolvedValue(updatedNote);

      const result = await controller.update(
        mockNote.id,
        updateNoteDto,
        mockRequest,
      );

      expect(notesService.findNoteById).toHaveBeenCalledWith(mockNote.id);
      expect(notesService.updateNote).toHaveBeenCalledWith(
        mockNote.id,
        updateNoteDto,
      );
      expect(result).toEqual(updatedNote);
    });

    it('should throw ForbiddenException if user does not own the note', async () => {
      const updateNoteDto: UpdateNoteDto = {
        name: 'Updated Note',
      };

      const otherUserNote = { ...mockNote, userId: 'other-user-id' };
      mockNotesService.findNoteById.mockResolvedValue(otherUserNote);

      await expect(
        controller.update(mockNote.id, updateNoteDto, mockRequest),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should delete a note', async () => {
      mockNotesService.deleteNote.mockResolvedValue({
        message: 'Note deleted successfully',
      });

      const result = await controller.remove(mockNote.id, mockRequest);

      expect(notesService.deleteNote).toHaveBeenCalledWith(
        mockNote.id,
        mockUser.id,
      );
      expect(result).toEqual({ message: 'Note deleted successfully' });
    });
  });

  describe('archiveNote', () => {
    it('should archive a note', async () => {
      const archivedNote = { ...mockNote, isArchived: true };
      mockNotesService.archiveNote.mockResolvedValue(archivedNote);

      const result = await controller.archiveNote(mockNote.id);

      expect(notesService.archiveNote).toHaveBeenCalledWith(mockNote.id);
      expect(result).toEqual(archivedNote);
    });
  });

  describe('trashNote', () => {
    it('should trash a note', async () => {
      const trashedNote = { ...mockNote, isTrashed: true };
      mockNotesService.trashNote.mockResolvedValue(trashedNote);

      const result = await controller.trashNote(mockNote.id);

      expect(notesService.trashNote).toHaveBeenCalledWith(mockNote.id);
      expect(result).toEqual(trashedNote);
    });
  });

  describe('restoreNote', () => {
    it('should restore a note from trash', async () => {
      const restoredNote = { ...mockNote, isTrashed: false };
      mockNotesService.restoreNote.mockResolvedValue(restoredNote);

      const result = await controller.restoreNote(mockNote.id);

      expect(notesService.restoreNote).toHaveBeenCalledWith(mockNote.id);
      expect(result).toEqual(restoredNote);
    });
  });
});
