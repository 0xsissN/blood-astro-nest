import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('reporte_dashboard')
export class DashboardReport {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 20 })
  periodo!: string;

  @Column({ name: 'total_donaciones', default: 0 })
  totalDonaciones!: number;

  @Column({ name: 'donantes_recurrentes', default: 0 })
  donantesRecurrentes!: number;

  @Column({ name: 'grupos_criticos', default: 0 })
  gruposCriticos!: number;

  @Column({
    name: 'fecha_generacion',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaGeneracion!: Date;
}
