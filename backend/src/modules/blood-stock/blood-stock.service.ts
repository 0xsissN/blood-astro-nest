import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';

import { Repository, MoreThan } from 'typeorm';

import { BloodStock } from './entities/blood-stock.entity';
import { BloodType } from './entities/blood-type.entity';
import { BloodUnit } from '../donations/entities/blood-unit.entity';
import { BloodStockResponseDto } from './dto/blood-stock-response.dto';
import { BloodStockMapper } from './mapper/blood-stock.mapper';

@Injectable()
export class BloodStockService {
  private readonly logger = new Logger(BloodStockService.name);

  constructor(
    @InjectRepository(BloodStock)
    private readonly stockRepo: Repository<BloodStock>,
    @InjectRepository(BloodType)
    private readonly bloodTypeRepo: Repository<BloodType>,
    @InjectRepository(BloodUnit)
    private readonly bloodUnitRepo: Repository<BloodUnit>,
  ) {}

  async findAll(): Promise<BloodStockResponseDto[]> {
    const stocks = await this.stockRepo.find({
      relations: ['tipoSangre'],
    });

    return stocks.map((s) => BloodStockMapper.toResponseDto(s));
  }

  async syncStock(): Promise<void> {
    const bloodTypes = await this.bloodTypeRepo.find();

    for (const bloodType of bloodTypes) {
      const count = await this.bloodUnitRepo.count({
        where: {
          idTipoSangre: bloodType.id,
          activa: true,
          fechaVencimiento: MoreThan(new Date().toISOString().split('T')[0]),
        },
      });

      let stock = await this.stockRepo.findOne({
        where: { idTipoSangre: bloodType.id },
      });

      if (!stock) {
        stock = this.stockRepo.create({
          idTipoSangre: bloodType.id,
          cantidadUnidades: 0,
          estadoStock: 'normal',
        });
      }

      stock.cantidadUnidades = count;
      stock.fechaActualizacion = new Date();

      if (count <= 5) {
        stock.estadoStock = 'critico';
      } else if (count <= 15) {
        stock.estadoStock = 'bajo';
      } else {
        stock.estadoStock = 'normal';
      }

      await this.stockRepo.save(stock);
    }

    this.logger.log('Stock sincronizado desde unidades activas');
  }

  async getChartData() {
    const stocks = await this.stockRepo.find({
      relations: ['tipoSangre'],
      order: { id: 'ASC' },
    });

    const labels: string[] = [];
    const unidades: number[] = [];
    const nivelesCriticos: number[] = [];
    const estados: string[] = [];
    const colores: string[] = [];

    for (const s of stocks) {
      const label = `${s.tipoSangre.grupo}${s.tipoSangre.factorRh}`;
      labels.push(label);
      unidades.push(s.cantidadUnidades);
      nivelesCriticos.push(s.tipoSangre.nivelCritico);
      estados.push(s.estadoStock ?? 'normal');

      if (s.estadoStock === 'critico') {
        colores.push('#dc3545');
      } else if (s.estadoStock === 'bajo') {
        colores.push('#ffc107');
      } else {
        colores.push('#28a745');
      }
    }

    return { labels, unidades, nivelesCriticos, estados, colores };
  }

  @Cron(CronExpression.EVERY_HOUR)
  async autoSync(): Promise<void> {
    await this.syncStock();
  }
}
