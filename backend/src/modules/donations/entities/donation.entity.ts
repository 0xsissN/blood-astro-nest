import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Donor } from '../../donors/entities/donor.entity';
import { BloodType } from '../../donors/entities/blood-type.entity';
import { Campaign } from '../../campaigns/entities/campaign.entity';

@Entity('donacion')
export class Donation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'id_donante' })
  idDonante!: number;

  @ManyToOne(() => Donor)
  @JoinColumn({ name: 'id_donante' })
  donante!: Donor;

  @Column({ name: 'id_campania', nullable: true })
  idCampania!: number | null;

  @ManyToOne(() => Campaign)
  @JoinColumn({ name: 'id_campania' })
  campania!: Campaign | null;

  @Column({ name: 'id_tipo_sangre' })
  idTipoSangre!: number;

  @ManyToOne(() => BloodType)
  @JoinColumn({ name: 'id_tipo_sangre' })
  tipoSangre!: BloodType;

  @Column({ name: 'fecha_donacion', type: 'date' })
  fechaDonacion!: string;

  @Column({ name: 'cantidad_ml' })
  cantidadMl!: number;

  @Column({ type: 'varchar', length: 20, default: 'aprobada' })
  estado!: string;
}
