import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Note } from '../../notes/entities/note.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Note, (note) => note.category)
  notes: Note[];
}
