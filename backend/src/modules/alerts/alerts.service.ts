import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
} from 'typeorm';

import { StockAlert } from './entities/stock-alert.entity';
import { BloodStock } from '../blood-stock/entities/blood-stock.entity';
import { StockAlertResponseDto } from './dto/stock-alert-response.dto';

@Injectable()
export class AlertsService {
  constructor(
    @InjectRepository(StockAlert)
    private readonly alertRepo: Repository<StockAlert>,
    @InjectRepository(BloodStock)
    private readonly stockRepo: Repository<BloodStock>,
  ) {}

  async checkAndCreateAlerts(): Promise<StockAlertResponseDto[]> {
    const stocks = await this.stockRepo.find({
      relations: ['tipoSangre'],
    });

    const created: StockAlert[] = [];

    for (const stock of stocks) {
      const threshold = stock.tipoSangre.nivelCritico;

      if (stock.cantidadUnidades <= threshold) {
        const existing = await this.alertRepo.findOne({
          where: {
            idTipoSangre: stock.idTipoSangre,
            tipo: 'CRITICO',
            abierta: true,
          },
        });

        if (!existing) {
          const alert = this.alertRepo.create({
            idTipoSangre: stock.idTipoSangre,
            tipo: 'CRITICO',
            mensaje: `Stock crítico: ${stock.tipoSangre.grupo}${stock.tipoSangre.factorRh} tiene solo ${stock.cantidadUnidades} unidades (umbral: ${threshold})`,
          });
          created.push(await this.alertRepo.save(alert));
        }
      } else if (stock.cantidadUnidades <= threshold * 2) {
        const existing = await this.alertRepo.findOne({
          where: {
            idTipoSangre: stock.idTipoSangre,
            tipo: 'BAJO',
            abierta: true,
          },
        });

        if (!existing) {
          const alert = this.alertRepo.create({
            idTipoSangre: stock.idTipoSangre,
            tipo: 'BAJO',
            mensaje: `Stock bajo: ${stock.tipoSangre.grupo}${stock.tipoSangre.factorRh} tiene ${stock.cantidadUnidades} unidades (umbral crítico: ${threshold})`,
          });
          created.push(await this.alertRepo.save(alert));
        }
      } else {
        await this.alertRepo.update(
          { idTipoSangre: stock.idTipoSangre, abierta: true },
          { abierta: false },
        );
      }
    }

    return created.map((a) => this.toResponseDto(a));
  }

  async findAll(): Promise<StockAlertResponseDto[]> {
    const alerts = await this.alertRepo.find({
      relations: ['tipoSangre'],
      order: { fechaGenerada: 'DESC' },
    });
    return alerts.map((a) => this.toResponseDto(a));
  }

  async findActive(): Promise<StockAlertResponseDto[]> {
    const alerts = await this.alertRepo.find({
      where: { abierta: true },
      relations: ['tipoSangre'],
      order: { fechaGenerada: 'DESC' },
    });
    return alerts.map((a) => this.toResponseDto(a));
  }

  async resolve(id: number): Promise<StockAlertResponseDto> {
    const alert = await this.alertRepo.findOne({
      where: { id },
      relations: ['tipoSangre'],
    });

    if (!alert) {
      throw new NotFoundException(`Alerta con id ${id} no encontrada`);
    }

    alert.abierta = false;
    const saved = await this.alertRepo.save(alert);
    return this.toResponseDto(saved);
  }

  private toResponseDto(alert: StockAlert): StockAlertResponseDto {
    return {
      id: alert.id,
      tipoSangre: {
        id: alert.tipoSangre.id,
        grupo: alert.tipoSangre.grupo,
        factorRh: alert.tipoSangre.factorRh,
      },
      tipo: alert.tipo,
      mensaje: alert.mensaje,
      fechaGenerada: alert.fechaGenerada,
      abierta: alert.abierta,
    };
  }
}
