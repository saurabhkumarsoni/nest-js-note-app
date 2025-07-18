import { Module } from '@nestjs/common';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { CacheModule } from '@nestjs/cache-manager';
import { HttpModule } from '@nestjs/axios';
import { Tag } from 'src/tag/entities/tag.entity';
import { Category } from 'src/category/entities/category.entity';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RemindersService } from './reminders.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Note, User, Tag, Category]),
    UsersModule,
    CacheModule.register(),
    HttpModule,
    PrismaModule,
  ],
  controllers: [NotesController],
  providers: [NotesService, RemindersService],
})
export class NotesModule {}
