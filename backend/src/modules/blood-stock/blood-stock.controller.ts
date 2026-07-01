import { Controller, Get, Post, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { BloodStockService } from './blood-stock.service';
import { BloodStockResponseDto } from './dto/blood-stock-response.dto';

@Controller('blood-stock')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BloodStockController {
  constructor(private readonly bloodStockService: BloodStockService) {}

  @Get()
  @Roles('ADMIN', 'LABORATORISTA')
  async findAll(): Promise<BloodStockResponseDto[]> {
    return this.bloodStockService.findAll();
  }

  @Post('sync')
  @Roles('ADMIN')
  async sync(): Promise<{ message: string }> {
    await this.bloodStockService.syncStock();
    return { message: 'Stock sincronizado correctamente' };
  }
}
