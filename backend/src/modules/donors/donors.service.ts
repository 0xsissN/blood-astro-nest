import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Donor } from './entities/donor.entity';
import { BloodType } from './entities/blood-type.entity';
import { CreateDonorDto } from './dto/create-donor.dto';
import { UpdateDonorDto } from './dto/update-donor.dto';
import { DonorResponseDto } from './dto/donor-response.dto';
import { SearchDonorDto } from './dto/search-donor.dto';

@Injectable()
export class DonorsService {
  constructor(
    @InjectRepository(Donor)
    private readonly donorRepository: Repository<Donor>,
    @InjectRepository(BloodType)
    private readonly bloodTypeRepository: Repository<BloodType>,
  ) {}

  async create(createDonorDto: CreateDonorDto): Promise<DonorResponseDto> {
    const existingDonor = await this.donorRepository.findOne({
      where: { ci: createDonorDto.ci },
    });

    if (existingDonor) {
      throw new ConflictException('Ya existe un donante con esa CI');
    }

    const bloodType = await this.bloodTypeRepository.findOne({
      where: { id: createDonorDto.idTipoSangre },
    });

    if (!bloodType) {
      throw new NotFoundException('Tipo de sangre no encontrado');
    }

    const donor = this.donorRepository.create({
      ...createDonorDto,
      activo: true,
    });

    const saved = await this.donorRepository.save(donor);
    return this.toResponseDto(saved, bloodType);
  }

  async findAll(): Promise<DonorResponseDto[]> {
    const donors = await this.donorRepository.find({
      relations: ['tipoSangre'],
      order: { nombre: 'ASC' },
    });
    return donors.map((d) => this.toResponseDto(d, d.tipoSangre));
  }

  async findOne(id: number): Promise<DonorResponseDto> {
    const donor = await this.donorRepository.findOne({
      where: { id },
      relations: ['tipoSangre'],
    });

    if (!donor) {
      throw new NotFoundException(`Donante con id ${id} no encontrado`);
    }

    return this.toResponseDto(donor, donor.tipoSangre);
  }

  async update(
    id: number,
    updateDonorDto: UpdateDonorDto,
  ): Promise<DonorResponseDto> {
    const donor = await this.donorRepository.findOne({
      where: { id },
      relations: ['tipoSangre'],
    });

    if (!donor) {
      throw new NotFoundException(`Donante con id ${id} no encontrado`);
    }

    if (updateDonorDto.ci && updateDonorDto.ci !== donor.ci) {
      const existingDonor = await this.donorRepository.findOne({
        where: { ci: updateDonorDto.ci },
      });

      if (existingDonor) {
        throw new ConflictException('Ya existe otro donante con esa CI');
      }
    }

    if (updateDonorDto.idTipoSangre) {
      const bloodType = await this.bloodTypeRepository.findOne({
        where: { id: updateDonorDto.idTipoSangre },
      });

      if (!bloodType) {
        throw new NotFoundException('Tipo de sangre no encontrado');
      }
    }

    Object.assign(donor, updateDonorDto);
    const updated = await this.donorRepository.save(donor);

    const bloodType = updateDonorDto.idTipoSangre
      ? await this.bloodTypeRepository.findOne({
          where: { id: updateDonorDto.idTipoSangre },
        })
      : donor.tipoSangre;

    return this.toResponseDto(updated, bloodType);
  }

  async remove(id: number): Promise<{ message: string; desactivado: boolean }> {
    const donor = await this.donorRepository.findOne({
      where: { id },
      relations: ['tipoSangre'],
    });

    if (!donor) {
      throw new NotFoundException(`Donante con id ${id} no encontrado`);
    }

    const hasDonations = await this.donorRepository
      .createQueryBuilder('donor')
      .innerJoin('donacion', 'donacion', 'donacion.id_donante = donor.id')
      .where('donor.id = :id', { id })
      .getCount();

    if (hasDonations > 0) {
      donor.activo = false;
      await this.donorRepository.save(donor);
      return {
        message:
          'Donante desactivado exitosamente (posee donaciones registradas)',
        desactivado: true,
      };
    }

    await this.donorRepository.remove(donor);
    return {
      message: 'Donante eliminado exitosamente',
      desactivado: false,
    };
  }

  async search(searchDto: SearchDonorDto): Promise<DonorResponseDto[]> {
    const queryBuilder = this.donorRepository
      .createQueryBuilder('donor')
      .leftJoinAndSelect('donor.tipoSangre', 'tipoSangre')
      .where('donor.activo = :activo', { activo: true });

    if (searchDto.query) {
      queryBuilder.andWhere(
        '(donor.nombre ILIKE :query OR donor.apellido ILIKE :query OR donor.ci ILIKE :query OR tipoSangre.grupo ILIKE :query)',
        { query: `%${searchDto.query}%` },
      );
    }

    if (searchDto.nombre) {
      queryBuilder.andWhere(
        '(donor.nombre ILIKE :nombre OR donor.apellido ILIKE :nombre)',
        { nombre: `%${searchDto.nombre}%` },
      );
    }

    if (searchDto.ci) {
      queryBuilder.andWhere('donor.ci ILIKE :ci', { ci: `%${searchDto.ci}%` });
    }

    if (searchDto.tipoSangre) {
      queryBuilder.andWhere('tipoSangre.grupo ILIKE :grupo', {
        grupo: `%${searchDto.tipoSangre}%`,
      });
    }

    queryBuilder.orderBy('donor.nombre', 'ASC');

    const donors = await queryBuilder.getMany();
    return donors.map((d) => this.toResponseDto(d, d.tipoSangre));
  }

  async findAllBloodTypes(): Promise<BloodType[]> {
    return this.bloodTypeRepository.find({ order: { grupo: 'ASC' } });
  }

  private toResponseDto(
    donor: Donor,
    bloodType: BloodType | null,
  ): DonorResponseDto {
    return {
      id: donor.id,
      nombre: donor.nombre,
      apellido: donor.apellido,
      ci: donor.ci,
      telefono: donor.telefono,
      fechaNacimiento: donor.fechaNacimiento,
      tipoSangre: bloodType
        ? {
            id: bloodType.id,
            grupo: bloodType.grupo,
            factorRh: bloodType.factorRh,
          }
        : null!,
      activo: donor.activo,
    };
  }
}
