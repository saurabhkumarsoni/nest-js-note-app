import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Note } from 'src/notes/entities/note.entity';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Note, (note) => note.tags)
  notes: Note[];
}
