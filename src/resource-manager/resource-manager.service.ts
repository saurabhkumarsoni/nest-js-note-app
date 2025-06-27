import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResourceManager } from './entities/resource-manager.entity';
import { CreateResourceManagerDto } from './dto/create-resource-manager.dto';
import { UpdateResourceManagerDto } from './dto/update-resource-manager.dto';

@Injectable()
export class ResourceManagerService {
  constructor(
    @InjectRepository(ResourceManager)
    private repo: Repository<ResourceManager>,
  ) {}

  findAll() {
    return this.repo.find({
      relations: ['reportsTo'],
    });
  }

  async findOne(id: string) {
    const manager = await this.repo.findOne({
      where: { id },
      relations: ['reportsTo', 'repartees'],
    });
    if (!manager) throw new NotFoundException('Manager not found');
    return manager;
  }

  async create(dto: CreateResourceManagerDto) {
    const manager = this.repo.create(dto);

    if (dto.reportsToId) {
      const reportsTo = await this.repo.findOne({
        where: { id: dto.reportsToId },
      });
      if (!reportsTo)
        throw new NotFoundException('Reporting manager not found');
      manager.reportsTo = reportsTo;
    }

    return this.repo.save(manager);
  }

  async update(id: string, dto: UpdateResourceManagerDto) {
    const manager = await this.findOne(id);
    if (dto.reportsToId) {
      const reportsTo = await this.repo.findOne({
        where: { id: dto.reportsToId },
      });
      if (!reportsTo)
        throw new NotFoundException('Reporting manager not found');
      manager.reportsTo = reportsTo;
    }

    Object.assign(manager, dto);
    return this.repo.save(manager);
  }

  async remove(id: string) {
    const manager = await this.findOne(id);
    return this.repo.remove(manager);
  }
}
