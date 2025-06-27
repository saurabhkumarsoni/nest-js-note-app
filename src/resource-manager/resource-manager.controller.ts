import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ResourceManagerService } from './resource-manager.service';
import { CreateResourceManagerDto } from './dto/create-resource-manager.dto';
import { UpdateResourceManagerDto } from './dto/update-resource-manager.dto';
import { ParseUUIDPipe } from '@nestjs/common';

@Controller('resource-managers')
export class ResourceManagerController {
  constructor(private readonly service: ResourceManagerService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateResourceManagerDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateResourceManagerDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Get(':id/repartees')
  async getRepartees(@Param('id', new ParseUUIDPipe()) id: string) {
    const manager = await this.service.findOne(id);
    return manager.repartees;
  }
}
