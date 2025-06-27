import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResourceManager } from './entities/resource-manager.entity';
import { ResourceManagerService } from './resource-manager.service';
import { ResourceManagerController } from './resource-manager.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ResourceManager])],
  providers: [ResourceManagerService],
  controllers: [ResourceManagerController],
})
export class ResourceManagerModule {}
