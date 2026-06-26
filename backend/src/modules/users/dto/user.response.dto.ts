import { RoleResponseDTO } from './role.response.dto';

export class UserResponseDTO {
  id!: number;
  nombre!: string;
  correo!: string;
  rol!: RoleResponseDTO;
  activo!: boolean;
}
