import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Role } from './role.entity';

@Entity('usuario')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  nombre!: string;

  @Column({ unique: true, length: 120 })
  correo!: string;

  @Column({ name: 'password_hash', length: 255 })
  passwordHash!: string;

  @Column({ name: 'id_rol' })
  idRol!: number;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'id_rol' })
  rol!: Role;

  @Column({ default: true })
  activo!: boolean;
}
