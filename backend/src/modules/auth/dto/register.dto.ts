import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class RegisterDto {
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @Length(3, 100, { message: 'El nombre debe tener entre 3 y 100 caracteres' })
  nombre!: string;

  @IsEmail({}, { message: 'El correo debe ser una dirección de correo válida' })
  @IsNotEmpty({ message: 'El correo es requerido' })
  correo!: string;

  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @Length(6, 50, {
    message: 'La contraseña debe tener entre 6 y 50 caracteres',
  })
  password!: string;

  @IsString({ message: 'El rol debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El rol es requerido' })
  rol!: string;
}
