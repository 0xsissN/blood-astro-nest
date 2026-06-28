import { Controller, Get } from '@nestjs/common';

import { BloodStockService } from './blood-stock.service';
import { BloodStockResponseDto } from './dto/blood-stock-response.dto';

@Controller('blood-stock')
export class BloodStockController {
  constructor(private readonly bloodStockService: BloodStockService) {}

  @Get()
  async findAll(): Promise<BloodStockResponseDto[]> {
    return this.bloodStockService.findAll();
  }
}
