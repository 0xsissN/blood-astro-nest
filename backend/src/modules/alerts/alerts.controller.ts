import {
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { AlertsService } from './alerts.service';
import { StockAlertResponseDto } from './dto/stock-alert-response.dto';

@Controller('alerts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  @Roles('ADMIN', 'LABORATORISTA')
  async findAll(): Promise<StockAlertResponseDto[]> {
    return this.alertsService.findAll();
  }

  @Get('active')
  @Roles('ADMIN', 'LABORATORISTA')
  async findActive(): Promise<StockAlertResponseDto[]> {
    return this.alertsService.findActive();
  }

  @Post('check')
  @Roles('ADMIN')
  async check(): Promise<StockAlertResponseDto[]> {
    return this.alertsService.checkAndCreateAlerts();
  }

  @Post(':id/resolve')
  @Roles('ADMIN')
  async resolve(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<StockAlertResponseDto> {
    return this.alertsService.resolve(id);
  }
}
