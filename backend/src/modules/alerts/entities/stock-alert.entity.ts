import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BloodType } from '../../blood-stock/entities/blood-type.entity';

@Entity('alerta_stock')
export class StockAlert {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'id_tipo_sangre' })
  idTipoSangre!: number;

  @ManyToOne(() => BloodType)
  @JoinColumn({ name: 'id_tipo_sangre' })
  tipoSangre!: BloodType;

  @Column({ length: 50 })
  tipo!: string;

  @Column({ type: 'text' })
  mensaje!: string;

  @Column({
    name: 'fecha_generada',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaGenerada!: Date;

  @Column({ default: true })
  abierta!: boolean;
}
