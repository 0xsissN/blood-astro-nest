import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { BloodType } from './blood-type.entity';

@Entity('donante')
export class Donor {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 60 })
  nombre!: string;

  @Column({ length: 60 })
  apellido!: string;

  @Column({ unique: true, length: 30 })
  ci!: string;

  @Column({ length: 25, nullable: true })
  telefono!: string;

  @Column({ name: 'fecha_nacimiento', type: 'date', nullable: true })
  fechaNacimiento!: string;

  @Column({ name: 'id_tipo_sangre' })
  idTipoSangre!: number;

  @ManyToOne(() => BloodType)
  @JoinColumn({ name: 'id_tipo_sangre' })
  tipoSangre!: BloodType;

  @Column({ default: true })
  activo!: boolean;
}
