import { apiGet } from './api';
import type { Donor, DonorStats, BloodType } from '../types/donor';

const DONORS_API = '/donors';

export async function getDonors(): Promise<Donor[]> {
  return apiGet<Donor[]>(DONORS_API);
}

export async function getDonor(id: number): Promise<Donor> {
  return apiGet<Donor>(`${DONORS_API}/${id}`);
}

export async function searchDonors(query: string): Promise<Donor[]> {
  return apiGet<Donor[]>(`${DONORS_API}/search?query=${encodeURIComponent(query)}`);
}

export async function searchDonorsByBloodType(tipoSangre: string): Promise<Donor[]> {
  return apiGet<Donor[]>(`${DONORS_API}/search?tipoSangre=${encodeURIComponent(tipoSangre)}`);
}

export async function getBloodTypes(): Promise<BloodType[]> {
  return apiGet<BloodType[]>('/donors/blood-types');
}

export async function getDonorStats(): Promise<DonorStats> {
  const donors = await getDonors();
  const totalDonantes = donors.length;
  const donantesActivos = donors.filter(d => d.activo).length;

  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const nuevosEsteMes = donors.filter(d => {
    const fechaRegistro = new Date(d.fechaNacimiento || '');
    return fechaRegistro >= firstDayOfMonth;
  }).length;

  return {
    totalDonantes,
    donantesActivos,
    nuevosEsteMes,
  };
}
