import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity('resource_managers')
export class ResourceManager {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  position: string;

  @Column()
  project: string;

  @Column({ nullable: true })
  image: string;

  // ✅ Reports To
  @ManyToOne(() => ResourceManager, (manager) => manager.repartees, {
    nullable: true,
  })
  @JoinColumn({ name: 'reportsToId' })
  reportsTo?: ResourceManager;

  @Column({ nullable: true })
  reportsToId?: string;

  // ✅ Repartees
  @OneToMany(() => ResourceManager, (manager) => manager.reportsTo)
  repartees: ResourceManager[];
}
