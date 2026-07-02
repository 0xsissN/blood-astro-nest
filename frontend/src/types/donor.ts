export interface BloodType {
  id: number;
  grupo: string;
  factorRh: string;
}

export interface Donor {
  id: number;
  nombre: string;
  apellido: string;
  ci: string;
  telefono: string | null;
  fechaNacimiento: string | null;
  tipoSangre: BloodType;
  activo: boolean;
}

export interface DonorStats {
  totalDonantes: number;
  donantesActivos: number;
  nuevosEsteMes: number;
}
