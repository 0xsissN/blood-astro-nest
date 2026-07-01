import { BloodTypeResponseDto } from './blood-type-response.dto';

export class BloodStockResponseDto {
  id!: number;
  tipoSangre!: BloodTypeResponseDto;
  cantidadUnidades!: number;
  fechaActualizacion!: Date;
  estadoStock!: string | null;
}
