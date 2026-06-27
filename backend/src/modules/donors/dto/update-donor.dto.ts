import { IsString, IsOptional, Length, IsNumber } from 'class-validator';

export class UpdateDonorDto {
  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @Length(2, 60, { message: 'El nombre debe tener entre 2 y 60 caracteres' })
  nombre?: string;

  @IsOptional()
  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @Length(2, 60, { message: 'El apellido debe tener entre 2 y 60 caracteres' })
  apellido?: string;

  @IsOptional()
  @IsString({ message: 'La CI debe ser una cadena de texto' })
  @Length(5, 30, { message: 'La CI debe tener entre 5 y 30 caracteres' })
  ci?: string;

  @IsOptional()
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @Length(7, 25, { message: 'El teléfono debe tener entre 7 y 25 caracteres' })
  telefono?: string;

  @IsOptional()
  @IsString({ message: 'La fecha de nacimiento debe ser una cadena de texto' })
  fechaNacimiento?: string;

  @IsOptional()
  @IsNumber({}, { message: 'El tipo de sangre debe ser un número' })
  idTipoSangre?: number;
}
