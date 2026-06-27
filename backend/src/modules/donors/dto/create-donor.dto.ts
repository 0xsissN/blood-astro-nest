import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  Length,
  IsNumber,
} from 'class-validator';

export class CreateDonorDto {
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @Length(2, 60, { message: 'El nombre debe tener entre 2 y 60 caracteres' })
  nombre!: string;

  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El apellido es requerido' })
  @Length(2, 60, { message: 'El apellido debe tener entre 2 y 60 caracteres' })
  apellido!: string;

  @IsString({ message: 'La CI debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La CI es requerida' })
  @Length(5, 30, { message: 'La CI debe tener entre 5 y 30 caracteres' })
  ci!: string;

  @IsOptional()
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @Length(7, 25, { message: 'El teléfono debe tener entre 7 y 25 caracteres' })
  telefono?: string;

  @IsOptional()
  @IsDateString(
    {},
    { message: 'La fecha de nacimiento debe ser una fecha válida' },
  )
  fechaNacimiento?: string;

  @IsNumber({}, { message: 'El tipo de sangre debe ser un número' })
  @IsNotEmpty({ message: 'El tipo de sangre es requerido' })
  idTipoSangre!: number;
}
