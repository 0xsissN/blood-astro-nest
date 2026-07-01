import {
  IsNumber,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateDonationDto {
  @IsNumber({}, { message: 'El ID del donante debe ser un número' })
  @IsNotEmpty({ message: 'El donante es requerido' })
  idDonante!: number;

  @IsOptional()
  @IsNumber({}, { message: 'El ID de la campaña debe ser un número' })
  idCampania?: number;

  @IsNumber({}, { message: 'El ID del tipo de sangre debe ser un número' })
  @IsNotEmpty({ message: 'El tipo de sangre es requerido' })
  idTipoSangre!: number;

  @IsDateString(
    {},
    { message: 'La fecha de donación debe ser una fecha válida' },
  )
  @IsNotEmpty({ message: 'La fecha de donación es requerida' })
  fechaDonacion!: string;

  @IsNumber({}, { message: 'La cantidad debe ser un número' })
  @Min(1, { message: 'La cantidad debe ser mayor a 0' })
  @IsNotEmpty({ message: 'La cantidad es requerida' })
  cantidadMl!: number;

  @IsOptional()
  @IsString({ message: 'El estado debe ser una cadena de texto' })
  estado?: string;
}
