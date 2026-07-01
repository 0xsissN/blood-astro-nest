import {
  Controller,
  Get,
  Post,
  UseGuards,
  Res,
} from '@nestjs/common';

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

  @Get('chart')
  @Roles('ADMIN', 'LABORATORISTA')
  async getChartData() {
    return this.bloodStockService.getChartData();
  }

  @Get('stream')
  @Roles('ADMIN', 'LABORATORISTA')
  async stream(@Res() res: any) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    const sendData = async () => {
      const data = await this.bloodStockService.getChartData();
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    await sendData();
    const interval = setInterval(sendData, 5000);

    res.on('close', () => {
      clearInterval(interval);
      res.end();
    });
  }

  @Post('sync')
  @Roles('ADMIN')
  async sync(): Promise<{ message: string }> {
    await this.bloodStockService.syncStock();
    return { message: 'Stock sincronizado correctamente' };
  }
}
