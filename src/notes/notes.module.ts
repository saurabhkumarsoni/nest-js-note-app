import { Module } from '@nestjs/common';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { CacheModule } from '@nestjs/cache-manager';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([Note, User]),
    UsersModule,
    CacheModule.register(),
    HttpModule,
  ],
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}
