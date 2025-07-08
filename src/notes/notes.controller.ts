import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UseGuards,
  Req,
  ForbiddenException,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Request } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Note } from './entities/note.entity';

@ApiTags('Notes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  async create(@Body() dto: CreateNoteDto, @Req() req: Request) {
    const user = req.user as any;
    return this.notesService.createNote(user.id, dto);
  }

  @Get('/search')
  async search(
    @Req() req: Request,
    @Query('search') search?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('limit') limit = '10',
    @Query('page') page = '1',
    @Query('sortBy') sortBy?: keyof Note,
    @Query('order') order?: 'ASC' | 'DESC',
    @Query('filter') filter?: 'all' | 'archived' | 'trashed',
  ) {
    const user = req.user as any;
    return this.notesService.getUserNotes({
      userId: user.id,
      search,
      fromDate,
      toDate,
      limit: parseInt(limit),
      page: parseInt(page),
      sortBy,
      order,
      filter,
    });
  }

  @Get()
  async findAll(
    @Req() req: Request,
    @Query('search') search?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('limit') limit = '10',
    @Query('page') page = '1',
    @Query('sortBy') sortBy?: keyof Note,
    @Query('order') order?: 'ASC' | 'DESC',
    @Query('filter') filter?: 'all' | 'archived' | 'trashed',
  ) {
    const user = req.user as any;
    return this.notesService.getUserNotes({
      userId: user.id,
      search: search?.trim() || undefined, // ✅ Avoid passing 'all'
      fromDate,
      toDate,
      limit: parseInt(limit),
      page: parseInt(page),
      sortBy,
      order,
      filter,
    });
  }

  @Get('reminders')
  async getReminders(@Req() req: Request) {
    const user = req.user as any;
    const userId = user.id;

    const now = new Date();
    const upcoming = new Date(now.getTime() + 5 * 60_000); // next 5 mins
    const recent = new Date(now.getTime() - 1 * 60_000); // past 1 min

    const dueNotes = await this.notesService.findDueReminders(
      userId,
      recent,
      now,
    );
    const upcomingNotes = await this.notesService.findDueReminders(
      userId,
      now,
      upcoming,
    );

    return {
      due: dueNotes,
      upcoming: upcomingNotes,
    };
  }

  @Get('count')
  getNoteCount(
    @Query('filter') filter: 'archived' | 'trashed',
    @Req() req: Request,
  ) {
    const userId = (req.user as any).id; // ← now truly a string
    return this.notesService.getNoteCount(filter, userId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    const user = req.user as any;
    const note = await this.notesService.findNoteById(id);
    if (!note || note.userId !== user.id) {
      throw new ForbiddenException('You do not have access to this note');
    }
    return note;
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateNoteDto,
    @Req() req: Request,
  ) {
    const user = req.user as any;
    const note = await this.notesService.findNoteById(id);
    if (!note || note.userId !== user.id) {
      throw new ForbiddenException('You do not have access to this note');
    }
    return this.notesService.updateNote(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    const user = req.user as any;
    return this.notesService.deleteNote(id, user.id);
  }

  @Patch(':id/archive')
  archiveNote(@Param('id', ParseUUIDPipe) id: string) {
    return this.notesService.archiveNote(id);
  }

  @Patch(':id/trash')
  trashNote(@Param('id', ParseUUIDPipe) id: string) {
    return this.notesService.trashNote(id);
  }

  @Patch(':id/restore')
  restoreNote(@Param('id', ParseUUIDPipe) id: string) {
    return this.notesService.restoreNote(id);
  }
}
