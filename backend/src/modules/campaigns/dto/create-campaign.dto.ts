import { IsString, IsNotEmpty, IsDateString, Length } from 'class-validator';

export class CreateCampaignDto {
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @Length(3, 120, { message: 'El nombre debe tener entre 3 y 120 caracteres' })
  nombre!: string;

  @IsString({ message: 'El lugar debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El lugar es requerido' })
  @Length(3, 150, { message: 'El lugar debe tener entre 3 y 150 caracteres' })
  lugar!: string;

  @IsDateString({}, { message: 'La fecha de inicio debe ser una fecha válida' })
  @IsNotEmpty({ message: 'La fecha de inicio es requerida' })
  fechaInicio!: string;

  @IsDateString({}, { message: 'La fecha de fin debe ser una fecha válida' })
  @IsNotEmpty({ message: 'La fecha de fin es requerida' })
  fechaFin!: string;
}
