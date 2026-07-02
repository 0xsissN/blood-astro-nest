import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BloodType } from './blood-type.entity';

@Entity('stock_sangre')
export class BloodStock {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'id_tipo_sangre' })
  idTipoSangre!: number;

  @ManyToOne(() => BloodType)
  @JoinColumn({ name: 'id_tipo_sangre' })
  tipoSangre!: BloodType;

  @Column({ name: 'cantidad_unidades', default: 0 })
  cantidadUnidades!: number;

  @Column({
    name: 'fecha_actualizacion',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaActualizacion!: Date;

  @Column({ name: 'estado_stock', type: 'varchar', length: 25, nullable: true })
  estadoStock!: string | null;
}
