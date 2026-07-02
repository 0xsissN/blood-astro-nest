import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateStockDto {
  @IsNumber({}, { message: 'La cantidad debe ser un número' })
  @Min(0, { message: 'La cantidad no puede ser negativa' })
  cantidadUnidades!: number;

  @IsOptional()
  @IsString({ message: 'El motivo debe ser texto' })
  motivo?: string;
}
