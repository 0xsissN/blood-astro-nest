export interface BloodTypeResponse {
  id: number;
  grupo: string;
  factorRh: string;
  descripcion: string;
  nivelCritico: number;
}

export interface BloodStockResponse {
  id: number;
  tipoSangre: BloodTypeResponse;
  cantidadUnidades: number;
  fechaActualizacion: string;
  estadoStock: "normal" | "bajo" | "critico";
}
