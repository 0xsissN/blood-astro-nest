export interface DonationDonor {
  id: number;
  nombre: string;
  apellido: string;
  ci: string;
}

export interface DonationCampaign {
  id: number;
  nombre: string;
}

export interface DonationBloodType {
  id: number;
  grupo: string;
  factorRh: string;
}

export interface Donation {
  id: number;
  donante: DonationDonor;
  campania: DonationCampaign | null;
  tipoSangre: DonationBloodType;
  fechaDonacion: string;
  cantidadMl: number;
  estado: string;
}

export interface CreateDonationRequest {
  idDonante: number;
  idCampania?: number;
  idTipoSangre: number;
  fechaDonacion: string;
  cantidadMl: number;
}
