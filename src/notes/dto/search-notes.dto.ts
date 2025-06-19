import { IsOptional, IsIn, IsString } from 'class-validator';

export class SearchNotesDto {
  @IsOptional()
  @IsString()
  query?: string;

  @IsOptional()
  @IsIn(['createdAt', 'updatedAt', 'name'])
  sortBy?: 'createdAt' | 'updatedAt' | 'name';

  @IsOptional()
  @IsIn(['ASC', 'DESC', 'asc', 'desc'])
  order?: 'ASC' | 'DESC';

  @IsOptional()
  limit?: number;

  @IsOptional()
  page?: number;
}
