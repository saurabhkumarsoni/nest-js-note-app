import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepo: Repository<Tag>,
  ) {}

  async create(dto: CreateTagDto): Promise<Tag> {
    const existing = await this.tagRepo.findOne({ where: { name: dto.name } });
    if (existing) return existing;

    const tag = this.tagRepo.create(dto);
    return this.tagRepo.save(tag);
  }

  async findAll(): Promise<Tag[]> {
    return this.tagRepo.find({ order: { name: 'ASC' } });
  }

  async update(id: number, dto: UpdateTagDto): Promise<Tag> {
    const tag = await this.tagRepo.findOne({ where: { id } });
    if (!tag) throw new NotFoundException('Tag not found');

    Object.assign(tag, dto);
    return this.tagRepo.save(tag);
  }

  async remove(id: number): Promise<{ message: string }> {
    const tag = await this.tagRepo.findOne({ where: { id } });
    if (!tag) throw new NotFoundException('Tag not found');

    await this.tagRepo.remove(tag);
    return { message: 'Tag deleted successfully' };
  }
}
