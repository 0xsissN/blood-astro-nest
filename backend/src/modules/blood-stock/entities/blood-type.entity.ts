import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tipo_sangre')
export class BloodType {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 3 })
  grupo!: string;

  @Column({ name: 'factor_rh', length: 5 })
  factorRh!: string;

  @Column({ length: 100, nullable: true })
  descripcion!: string;

  @Column({ name: 'nivel_critico' })
  nivelCritico!: number;
}
