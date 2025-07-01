import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Category])], // ✅ Needed for injecting repository
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService], // Optional, if other modules need it
})
export class CategoryModule {}
