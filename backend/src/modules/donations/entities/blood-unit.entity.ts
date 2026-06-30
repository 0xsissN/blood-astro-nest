import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Donation } from './donation.entity';
import { BloodType } from '../../donors/entities/blood-type.entity';

@Entity('unidad_sangre')
export class BloodUnit {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'codigo_unidad', unique: true, length: 50 })
  codigoUnidad!: string;

  @Column({ name: 'id_donacion' })
  idDonacion!: number;

  @ManyToOne(() => Donation)
  @JoinColumn({ name: 'id_donacion' })
  donacion!: Donation;

  @Column({ name: 'id_tipo_sangre' })
  idTipoSangre!: number;

  @ManyToOne(() => BloodType)
  @JoinColumn({ name: 'id_tipo_sangre' })
  tipoSangre!: BloodType;

  @Column({ name: 'fecha_extraccion', type: 'date' })
  fechaExtraccion!: string;

  @Column({ name: 'fecha_vencimiento', type: 'date' })
  fechaVencimiento!: string;

  @Column({ default: true })
  activa!: boolean;
}
