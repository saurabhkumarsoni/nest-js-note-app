import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Note } from '../../notes/entities/note.entity';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'varchar', nullable: true })
  profileImage: string;

  @Column({ type: 'varchar', nullable: true })
  dateOfBirth: string;

  @Column({ type: 'varchar', nullable: true })
  dateOfJoining: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  gender: string;

  @Column({ type: 'varchar', nullable: true })
  position: string;

  @Column({ type: 'varchar', nullable: true })
  department: string;

  @Column({ type: 'varchar', nullable: true })
  employeeId: string;

  @Column({ type: 'varchar', nullable: true })
  reportingManager: string;

  @Column({ type: 'varchar', nullable: true })
  experience: string;

  @Column({ type: 'boolean', default: false })
  isMarried: boolean;

  @Column({ type: 'varchar', nullable: true })
  linkedin: string;

  @Column({ type: 'varchar', nullable: true })
  github: string;

  @Column({ type: 'jsonb', nullable: true })
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };

  @Column({ type: 'text', array: true, nullable: true })
  skills: string[];

  @Column({ type: 'jsonb', nullable: true })
  projects: {
    name: string;
    description: string;
    techStack: string;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  education: {
    degree: string;
    university: string;
    yearOfPassing: number;
  }[];

  @Exclude()
  @Column({ type: 'varchar', length: 200 })
  password: string;

  @Column({ type: 'text', nullable: true, select: false })
  hashedRefreshToken: string | null;

  @OneToMany(() => Note, (note) => note.user)
  notes: Note[];
}
