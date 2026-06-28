import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { BloodStock } from './entities/blood-stock.entity';
import { BloodStockResponseDto } from './dto/blood-stock-response.dto';
import { BloodStockMapper } from './mapper/blood.stock.mapper';

@Injectable()
export class BloodStockService {
  constructor(
    @InjectRepository(BloodStock)
    private readonly stockRepo: Repository<BloodStock>,
  ) {}

  async findAll(): Promise<BloodStockResponseDto[]> {
    const stocks = await this.stockRepo.find({
      relations: ['tipoSangre'],
    });

    return stocks.map((s) => BloodStockMapper.toResponseDto(s));
  }
}
