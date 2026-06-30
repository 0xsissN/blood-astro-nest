import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('campania')
export class Campaign {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 120 })
  nombre!: string;

  @Column({ length: 150 })
  lugar!: string;

  @Column({ name: 'fecha_inicio', type: 'date' })
  fechaInicio!: string;

  @Column({ name: 'fecha_fin', type: 'date' })
  fechaFin!: string;

  @Column({ default: true })
  activa!: boolean;
}
