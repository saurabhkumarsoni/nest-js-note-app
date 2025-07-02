import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './entities/note.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Tag } from 'src/tag/entities/tag.entity';
import { Category } from 'src/category/entities/category.entity';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepo: Repository<Note>,

    @InjectRepository(Tag)
    private readonly tagRepo: Repository<Tag>,

    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,

    private prisma: PrismaService,
  ) {}

  async createNote(userId: number, dto: CreateNoteDto): Promise<Note> {
    const category = await this.getCategoryOrFail(dto.categoryId);

    const normalizedTags = this.extractTagNames(dto.tags ?? []);
    const tags = normalizedTags.length
      ? await this.preloadTags(normalizedTags)
      : [];

    const note = this.noteRepo.create({
      ...dto,
      userId,
      tags,
      category,
    } as Partial<Note>);

    return this.noteRepo.save(note);
  }

  async getUserNotes({
    userId,
    search,
    fromDate,
    toDate,
    limit,
    page,
    sortBy = 'createdAt',
    order = 'DESC',
    filter = 'all',
  }: {
    userId: string;
    search?: string;
    fromDate?: string;
    toDate?: string;
    limit: number;
    page: number;
    sortBy?: string;
    order?: string;
    filter?: 'all' | 'archived' | 'trashed';
  }) {
    // ✅ Normalize sort order
    const normalizedOrder = order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const qb = this.noteRepo
      .createQueryBuilder('note')
      .leftJoinAndSelect('note.tags', 'tags')
      .leftJoinAndSelect('note.category', 'category')
      .where('note.userId = :userId', { userId });

    if (fromDate) {
      qb.andWhere('note.createdAt >= :fromDate', { fromDate });
    }

    if (toDate) {
      qb.andWhere('note.createdAt <= :toDate', { toDate });
    }
    if (filter === 'archived') {
      qb.andWhere('note.isArchived = true');
    } else if (filter === 'trashed') {
      qb.andWhere('note.isTrashed = true');
    } else {
      // Default: active notes only (not archived or trashed)
      qb.andWhere('note.isArchived = false');
      qb.andWhere('note.isTrashed = false');
    }

    if (search) {
      qb.andWhere(
        '(LOWER(note.name) LIKE LOWER(:search) OR LOWER(note.content) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    const [notes, total] = await qb
      .orderBy(`note.${sortBy}`, normalizedOrder)
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      notes,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findNoteById(id: string): Promise<Note | null> {
    return this.noteRepo.findOne({
      where: { id },
      relations: ['tags', 'category'],
    });
  }

  async updateNote(id: string, dto: UpdateNoteDto): Promise<Note> {
    const existing = await this.noteRepo.findOneOrFail({
      where: { id },
      relations: ['tags', 'category'],
    });

    const category = await this.getCategoryOrFail(dto.categoryId);

    const normalizedTags = this.extractTagNames(dto.tags ?? []);
    const tags = normalizedTags.length
      ? await this.preloadTags(normalizedTags)
      : [];

    const updated = this.noteRepo.merge(existing, {
      ...dto,
      tags,
      category,
    });

    return this.noteRepo.save(updated);
  }

  async deleteNote(id: string, userId: number): Promise<{ message: string }> {
    const note = await this.findNoteById(id);
    if (!note) throw new NotFoundException('Note not found');
    if (note.userId !== userId) throw new ForbiddenException('Access denied');

    await this.noteRepo.remove(note);
    return { message: 'Note deleted successfully' };
  }

  // ----- Private Helpers -----

  private async preloadTags(tagNames: string[]): Promise<Tag[]> {
    const tags: Tag[] = [];

    for (const name of tagNames) {
      const existing = await this.tagRepo.findOne({ where: { name } });
      if (existing) {
        tags.push(existing);
      } else {
        const newTag = this.tagRepo.create({ name });
        tags.push(await this.tagRepo.save(newTag));
      }
    }

    return tags;
  }

  private extractTagNames(rawTags: any[]): string[] {
    if (!Array.isArray(rawTags)) return [];

    return rawTags.map((tag) => {
      if (typeof tag === 'string') return tag;
      if (typeof tag === 'object' && 'name' in tag) return tag.name;
      return String(tag);
    });
  }

  private async getCategoryOrFail(
    categoryId?: number,
  ): Promise<Category | null> {
    if (!categoryId) return null;
    const category = await this.categoryRepo.findOne({
      where: { id: categoryId },
    });
    if (!category) throw new BadRequestException('Invalid category ID');
    return category;
  }

  async archiveNote(id: string) {
    return this.noteRepo.update(id, { isArchived: true });
  }

  async trashNote(id: string) {
    return this.noteRepo.update(id, { isTrashed: true });
  }

  async restoreNote(id: string) {
    return this.noteRepo.update(id, {
      isArchived: false,
      isTrashed: false,
    });
  }
  // notes.service.ts

  async getNoteCount(
    filter: 'all' | 'archived' | 'trashed',
    userId: string,
  ): Promise<{ count: number }> {
    const where: any = { userId };

    if (filter === 'archived') where.isArchived = true;
    else if (filter === 'trashed') where.isTrashed = true;
    // 'all' → no extra flags

    const count = await this.noteRepo.count({ where });
    return { count };
  }
}
