export class DonationResponseDto {
  id!: number;
  donante!: {
    id: number;
    nombre: string;
    apellido: string;
    ci: string;
  };
  campania!: {
    id: number;
    nombre: string;
  } | null;
  tipoSangre!: {
    id: number;
    grupo: string;
    factorRh: string;
  };
  fechaDonacion!: string;
  cantidadMl!: number;
  estado!: string;
}
