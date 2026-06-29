import { BloodTypeResponseDto } from '../dto/blood-type-response.dto';
import { BloodType } from '../entities/blood-type.entity';

export class BloodTypeMapper {
  static toResponseDto(tipo: BloodType): BloodTypeResponseDto {
    return {
      id: tipo.id,
      grupo: tipo.grupo,
      factorRh: tipo.factorRh,
      descripcion: tipo.descripcion,
      nivelCritico: tipo.nivelCritico,
    };
  }
}
