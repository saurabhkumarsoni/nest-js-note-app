import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Tag } from 'src/tag/entities/tag.entity';
import { Category } from '../../category/entities/category.entity';

@Entity()
export class Note {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  content: string;

  @Column({ nullable: true })
  quoteId?: string;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.notes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToMany(() => Tag, (tag) => tag.notes, { cascade: true, eager: true })
  @JoinTable()
  tags: Tag[];

  @ManyToOne(() => Category, { nullable: true, eager: true })
  @JoinColumn({ name: 'categoryId' })
  category: Category | null;

  @Column({ nullable: true })
  categoryId: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
