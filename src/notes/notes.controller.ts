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
    return this.notesService.createNote(user.id, dto); // ✅ Fixed order
  }

  @Get('/search')
  async search(
    @Req() req: Request,
    @Query('search') search?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('limit') limit = '10',
    @Query('page') page = '1',
    @Query('sortBy') sortBy?: string,
    @Query('order') order?: string,
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
    });
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
    });
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

    return this.notesService.updateNote(id, dto); // ✅ Fixed number of arguments
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    const user = req.user as any;
    return this.notesService.deleteNote(id, user.id);
  }
}
