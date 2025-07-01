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

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepo: Repository<Note>,

    @InjectRepository(Tag)
    private readonly tagRepo: Repository<Tag>,

    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
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
    sortBy = 'updatedAt',
    order = 'DESC',
  }: {
    userId: number;
    search?: string;
    fromDate?: string;
    toDate?: string;
    limit: number;
    page: number;
    sortBy?: string;
    order?: string;
  }) {
    const validSortFields: (keyof Note)[] = ['createdAt', 'updatedAt', 'name'];
    const safeSortBy = validSortFields.includes(sortBy as keyof Note)
      ? (sortBy as keyof Note)
      : 'updatedAt';

    const safeOrder: 'ASC' | 'DESC' =
      order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    let query = this.noteRepo
      .createQueryBuilder('note')
      .leftJoinAndSelect('note.tags', 'tag')
      .leftJoinAndSelect('note.category', 'category')
      .where('note.userId = :userId', { userId });

    if (search) {
      query = query.andWhere(
        '(note.name ILIKE :search OR note.content ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (fromDate) {
      query = query.andWhere('note.createdAt >= :fromDate', { fromDate });
    }

    if (toDate) {
      query = query.andWhere('note.createdAt <= :toDate', { toDate });
    }

    const [notes, totalCount] = await query
      .orderBy(`note.${safeSortBy}`, safeOrder)
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const totalPages = Math.ceil(totalCount / limit);
    return { notes, totalPages };
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
}
