import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async findOneByEmail(correo: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { correo, activo: true },
      relations: ['rol'],
    });
  }

  async findOneById(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id, activo: true },
      relations: ['rol'],
    });
  }

  async findRoleByName(nombre: string): Promise<Role | null> {
    return this.roleRepository.findOne({ where: { nombre } });
  }

  async createUser(data: Partial<User>): Promise<User> {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }
}
