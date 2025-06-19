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
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepo: Repository<Note>,
  ) {}

  async createNote(dto: CreateNoteDto, user: any): Promise<Note> {
    if (!user?.id) throw new BadRequestException('User not found in request');

    const note = this.noteRepo.create({
      ...dto,
      quoteId: uuidv4(),
      userId: user.id,
    });

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
    return this.noteRepo.findOne({ where: { id } });
  }

  async updateNote(
    id: string,
    dto: UpdateNoteDto,
    userId: number,
  ): Promise<Note> {
    const note = await this.findNoteById(id);
    if (!note) throw new NotFoundException('Note not found');
    if (note.userId !== userId) throw new ForbiddenException('Access denied');

    Object.assign(note, dto);
    return this.noteRepo.save(note);
  }

  async deleteNote(id: string, userId: number): Promise<{ message: string }> {
    const note = await this.findNoteById(id);
    if (!note) throw new NotFoundException('Note not found');
    if (note.userId !== userId) throw new ForbiddenException('Access denied');

    await this.noteRepo.remove(note);
    return { message: 'Note deleted successfully' };
  }
}
