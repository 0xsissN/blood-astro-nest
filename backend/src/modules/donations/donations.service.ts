import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager } from 'typeorm';

import { Donation } from './entities/donation.entity';
import { BloodUnit } from './entities/blood-unit.entity';
import { BloodStock } from './entities/blood-stock.entity';
import { Donor } from '../donors/entities/donor.entity';
import { BloodType } from '../donors/entities/blood-type.entity';
import { CreateDonationDto } from './dto/create-donation.dto';
import { DonationResponseDto } from './dto/donation-response.dto';
import { FilterDonationDto } from './dto/filter-donation.dto';

interface MonthlyStatRaw {
  mes: string;
  total_donaciones: string;
  total_ml: string;
  promedio_ml: string;
}

interface RecurringDonorRaw {
  donorid: string;
  nombre: string;
  apellido: string;
  ci: string;
  totaldonaciones: string;
  totalml: string;
}

@Injectable()
export class DonationsService {
  constructor(
    @InjectRepository(Donation)
    private readonly donationRepository: Repository<Donation>,
    @InjectRepository(BloodUnit)
    private readonly bloodUnitRepository: Repository<BloodUnit>,
    @InjectRepository(BloodStock)
    private readonly bloodStockRepository: Repository<BloodStock>,
    @InjectRepository(Donor)
    private readonly donorRepository: Repository<Donor>,
    @InjectRepository(BloodType)
    private readonly bloodTypeRepository: Repository<BloodType>,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createDonationDto: CreateDonationDto,
  ): Promise<DonationResponseDto> {
    const donor = await this.donorRepository.findOne({
      where: { id: createDonationDto.idDonante, activo: true },
      relations: ['tipoSangre'],
    });

    if (!donor) {
      throw new NotFoundException('Donante no encontrado o inactivo');
    }

    const bloodType = await this.bloodTypeRepository.findOne({
      where: { id: createDonationDto.idTipoSangre },
    });

    if (!bloodType) {
      throw new NotFoundException('Tipo de sangre no encontrado');
    }

    if (
      createDonationDto.cantidadMl < 200 ||
      createDonationDto.cantidadMl > 500
    ) {
      throw new BadRequestException(
        'La cantidad de sangre debe estar entre 200ml y 500ml',
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const donation = this.donationRepository.create({
        ...createDonationDto,
        estado: createDonationDto.estado || 'aprobada',
      });
      const savedDonation = await queryRunner.manager.save(donation);

      const now = new Date();
      const expiryDate = new Date(now);
      expiryDate.setDate(expiryDate.getDate() + 42);

      const unitCode = `UNI-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${savedDonation.id}`;

      const bloodUnit = this.bloodUnitRepository.create({
        codigoUnidad: unitCode,
        idDonacion: savedDonation.id,
        idTipoSangre: createDonationDto.idTipoSangre,
        fechaExtraccion: createDonationDto.fechaDonacion,
        fechaVencimiento: expiryDate.toISOString().split('T')[0],
        activa: true,
      });
      await queryRunner.manager.save(bloodUnit);

      await this.updateStock(
        queryRunner.manager,
        createDonationDto.idTipoSangre,
        1,
      );

      await queryRunner.commitTransaction();

      return this.toResponseDto(savedDonation, donor, bloodType);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(filter?: FilterDonationDto): Promise<DonationResponseDto[]> {
    const queryBuilder = this.donationRepository
      .createQueryBuilder('donacion')
      .leftJoinAndSelect('donacion.donante', 'donante')
      .leftJoinAndSelect('donacion.tipoSangre', 'tipoSangre')
      .leftJoinAndSelect('donacion.campania', 'campania');

    if (filter?.fechaInicio) {
      queryBuilder.andWhere('donacion.fecha_donacion >= :fechaInicio', {
        fechaInicio: filter.fechaInicio,
      });
    }

    if (filter?.fechaFin) {
      queryBuilder.andWhere('donacion.fecha_donacion <= :fechaFin', {
        fechaFin: filter.fechaFin,
      });
    }

    if (filter?.idDonante) {
      queryBuilder.andWhere('donacion.id_donante = :idDonante', {
        idDonante: filter.idDonante,
      });
    }

    if (filter?.estado) {
      queryBuilder.andWhere('donacion.estado = :estado', {
        estado: filter.estado,
      });
    }

    queryBuilder.orderBy('donacion.fecha_donacion', 'DESC');

    const donations = await queryBuilder.getMany();
    return donations.map((d) => this.toResponseDto(d, d.donante, d.tipoSangre));
  }

  async findByDonor(
    donorId: number,
    fechaInicio?: string,
    fechaFin?: string,
  ): Promise<DonationResponseDto[]> {
    const queryBuilder = this.donationRepository
      .createQueryBuilder('donacion')
      .leftJoinAndSelect('donacion.donante', 'donante')
      .leftJoinAndSelect('donacion.tipoSangre', 'tipoSangre')
      .leftJoinAndSelect('donacion.campania', 'campania')
      .where('donacion.id_donante = :donorId', { donorId });

    if (fechaInicio) {
      queryBuilder.andWhere('donacion.fecha_donacion >= :fechaInicio', {
        fechaInicio,
      });
    }

    if (fechaFin) {
      queryBuilder.andWhere('donacion.fecha_donacion <= :fechaFin', {
        fechaFin,
      });
    }

    queryBuilder.orderBy('donacion.fecha_donacion', 'DESC');

    const donations = await queryBuilder.getMany();
    return donations.map((d) => this.toResponseDto(d, d.donante, d.tipoSangre));
  }

  async findOne(id: number): Promise<DonationResponseDto> {
    const donation = await this.donationRepository.findOne({
      where: { id },
      relations: ['donante', 'tipoSangre', 'campania'],
    });

    if (!donation) {
      throw new NotFoundException(`Donación con id ${id} no encontrada`);
    }

    return this.toResponseDto(donation, donation.donante, donation.tipoSangre);
  }

  async getMonthlyStats(year: number) {
    const stats = await this.donationRepository
      .createQueryBuilder('donacion')
      .select('EXTRACT(MONTH FROM donacion.fecha_donacion)', 'mes')
      .addSelect('COUNT(*)', 'total_donaciones')
      .addSelect('SUM(donacion.cantidad_ml)', 'total_ml')
      .addSelect('AVG(donacion.cantidad_ml)', 'promedio_ml')
      .where('EXTRACT(YEAR FROM donacion.fecha_donacion) = :year', { year })
      .groupBy('EXTRACT(MONTH FROM donacion.fecha_donacion)')
      .orderBy('mes', 'ASC')
      .getRawMany<MonthlyStatRaw>();

    const months = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];

    return stats.map((stat) => ({
      mes: months[Number(stat.mes) - 1],
      mesNumero: Number(stat.mes),
      totalDonaciones: Number(stat.total_donaciones),
      totalMl: Number(stat.total_ml),
      promedioMl: Number(Number(stat.promedio_ml).toFixed(0)),
    }));
  }

  async getRecurringDonors(fechaInicio?: string, fechaFin?: string) {
    const queryBuilder = this.donationRepository
      .createQueryBuilder('donacion')
      .leftJoin('donacion.donante', 'donante')
      .select('donante.id', 'donorId')
      .addSelect('donante.nombre', 'nombre')
      .addSelect('donante.apellido', 'apellido')
      .addSelect('donante.ci', 'ci')
      .addSelect('COUNT(donacion.id)', 'totalDonaciones')
      .addSelect('SUM(donacion.cantidad_ml)', 'totalMl')
      .where('donante.activo = :activo', { activo: true });

    if (fechaInicio) {
      queryBuilder.andWhere('donacion.fecha_donacion >= :fechaInicio', {
        fechaInicio,
      });
    }

    if (fechaFin) {
      queryBuilder.andWhere('donacion.fecha_donacion <= :fechaFin', {
        fechaFin,
      });
    }

    const donors = await queryBuilder
      .groupBy('donante.id')
      .addGroupBy('donante.nombre')
      .addGroupBy('donante.apellido')
      .addGroupBy('donante.ci')
      .orderBy('totalDonaciones', 'DESC')
      .limit(10)
      .getRawMany<RecurringDonorRaw>();

    return donors.map((d, index) => ({
      posicion: index + 1,
      donorId: Number(d.donorid),
      nombre: d.nombre,
      apellido: d.apellido,
      ci: d.ci,
      totalDonaciones: Number(d.totaldonaciones),
      totalMl: Number(d.totalml),
    }));
  }

  private async updateStock(
    manager: EntityManager,
    idTipoSangre: number,
    unitsToAdd: number,
  ) {
    let stock = await this.bloodStockRepository.findOne({
      where: { idTipoSangre },
    });

    if (!stock) {
      stock = this.bloodStockRepository.create({
        idTipoSangre,
        cantidadUnidades: 0,
        estadoStock: 'normal',
      });
    }

    stock.cantidadUnidades += unitsToAdd;
    stock.fechaActualizacion = new Date();

    if (stock.cantidadUnidades <= 5) {
      stock.estadoStock = 'critico';
    } else if (stock.cantidadUnidades <= 15) {
      stock.estadoStock = 'bajo';
    } else {
      stock.estadoStock = 'normal';
    }

    await manager.save(stock);
  }

  private toResponseDto(
    donation: Donation,
    donor: Donor,
    bloodType: BloodType,
  ): DonationResponseDto {
    return {
      id: donation.id,
      donante: {
        id: donor.id,
        nombre: donor.nombre,
        apellido: donor.apellido,
        ci: donor.ci,
      },
      campania: donation.campania
        ? {
            id: donation.campania.id,
            nombre: donation.campania.nombre,
          }
        : null,
      tipoSangre: {
        id: bloodType.id,
        grupo: bloodType.grupo,
        factorRh: bloodType.factorRh,
      },
      fechaDonacion: donation.fechaDonacion,
      cantidadMl: donation.cantidadMl,
      estado: donation.estado,
    };
  }
}
