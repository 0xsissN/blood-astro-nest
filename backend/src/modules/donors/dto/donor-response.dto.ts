export class DonorResponseDto {
  id!: number;
  nombre!: string;
  apellido!: string;
  ci!: string;
  telefono!: string | null;
  fechaNacimiento!: string | null;
  tipoSangre!: {
    id: number;
    grupo: string;
    factorRh: string;
  };
  activo!: boolean;
}
