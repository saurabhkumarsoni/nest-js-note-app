import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { NotePriority } from 'src/notes/entities/note.entity';

export class CreateNoteDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  quoteId?: string;

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsInt()
  categoryId?: number;

  @IsOptional()
  @IsBoolean()
  isArchived: boolean;

  @IsOptional()
  @IsBoolean()
  isTrashed: boolean;

  @IsEnum(NotePriority)
  @IsOptional()
  priority?: NotePriority;

  @IsOptional()
  @IsDateString()
  reminderAt?: string;
}
