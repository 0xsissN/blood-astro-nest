import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('rol')
export class Role {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, length: 30 })
  nombre!: string;
}
