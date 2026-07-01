export class StockAlertResponseDto {
  id!: number;
  tipoSangre!: {
    id: number;
    grupo: string;
    factorRh: string;
  };
  tipo!: string;
  mensaje!: string;
  fechaGenerada!: Date;
  abierta!: boolean;
}
