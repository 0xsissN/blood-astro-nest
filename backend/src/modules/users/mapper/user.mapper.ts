import { UserResponseDTO } from '../dto/user-response.dto';
import { User } from '../entities/user.entity';

export class UserMapper {
  static toResponseDto(user: User): UserResponseDTO {
    return {
      id: user.id,
      nombre: user.nombre,
      correo: user.correo,
      rol: user.rol,
      activo: user.activo,
    };
  }
}
