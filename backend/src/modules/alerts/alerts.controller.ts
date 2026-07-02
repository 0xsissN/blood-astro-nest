import { Controller, Get, Post, Param, ParseIntPipe } from '@nestjs/common';

import { AlertsService } from './alerts.service';
import { StockAlertResponseDto } from './dto/stock-alert-response.dto';

@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  async findAll(): Promise<StockAlertResponseDto[]> {
    return this.alertsService.findAll();
  }

  @Get('active')
  async findActive(): Promise<StockAlertResponseDto[]> {
    return this.alertsService.findActive();
  }

  @Post('check')
  async check(): Promise<StockAlertResponseDto[]> {
    return this.alertsService.checkAndCreateAlerts();
  }

  @Post(':id/resolve')
  async resolve(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<StockAlertResponseDto> {
    return this.alertsService.resolve(id);
  }
}
