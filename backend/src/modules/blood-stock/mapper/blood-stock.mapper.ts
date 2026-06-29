import { BloodStockResponseDto } from '../dto/blood-stock-response.dto';
import { BloodStock } from '../entities/blood-stock.entity';
import { BloodTypeMapper } from './blood-type.mapper';

export class BloodStockMapper {
  static toResponseDto(stock: BloodStock): BloodStockResponseDto {
    return {
      id: stock.id,
      tipoSangre: BloodTypeMapper.toResponseDto(stock.tipoSangre),
      cantidadUnidades: stock.cantidadUnidades,
      fechaActualizacion: stock.fechaActualizacion,
      estadoStock: stock.estadoStock,
    };
  }
}
