import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BloodStock } from './blood-stock.entity';

@Entity('historial_inventario')
export class StockAudit {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'id_stock_sangre' })
  idStockSangre!: number;

  @ManyToOne(() => BloodStock)
  @JoinColumn({ name: 'id_stock_sangre' })
  stockSangre!: BloodStock;

  @Column({ name: 'cantidad_anterior' })
  cantidadAnterior!: number;

  @Column({ name: 'cantidad_nueva' })
  cantidadNueva!: number;

  @Column({ length: 255, nullable: true })
  motivo!: string | null;

  @Column({
    name: 'fecha_modificacion',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaModificacion!: Date;
}
