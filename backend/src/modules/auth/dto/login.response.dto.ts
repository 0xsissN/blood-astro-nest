import { UserResponseDTO } from 'src/modules/users/dto/user.response.dto';

export class LoginResponseDto {
  accessToken!: string;
  user!: UserResponseDTO;
}
