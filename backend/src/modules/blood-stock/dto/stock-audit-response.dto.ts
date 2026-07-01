export class StockAuditResponseDto {
  id!: number;
  cantidadAnterior!: number;
  cantidadNueva!: number;
  motivo!: string | null;
  fechaModificacion!: Date;
}
