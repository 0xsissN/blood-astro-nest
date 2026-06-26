import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login.response.dto';
import { UserMapper } from '../users/mapper/user.mapper';
import { User } from '../users/entities/user.entity';
import { UserResponseDTO } from '../users/dto/user.response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.validateUser(loginDto);

    const payload = {
      sub: user.id,
      email: user.correo,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user: UserMapper.toResponseDto(user),
    };
  }

  async register(registerDto: RegisterDto): Promise<UserResponseDTO> {
    const existingUser = await this.usersService.findOneByEmail(
      registerDto.correo,
    );

    if (existingUser) {
      throw new ConflictException('El correo ya está registrado');
    }

    const role = await this.usersService.findRoleByName(registerDto.rol);

    if (!role) {
      throw new NotFoundException('Rol no encontrado');
    }

    const passwordHash = await bcrypt.hash(registerDto.password, 10);

    const user = await this.usersService.createUser({
      nombre: registerDto.nombre,
      correo: registerDto.correo,
      passwordHash,
      rol: role,
      activo: true,
    });

    return UserMapper.toResponseDto(user);
  }

  async validateUser(loginDto: LoginDto): Promise<User> {
    const user = await this.usersService.findOneByEmail(loginDto.correo);

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.passwordHash);

    if (!isMatch) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return user;
  }
}
