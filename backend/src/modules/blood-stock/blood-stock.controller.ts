import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  ParseIntPipe,
  Res,
} from '@nestjs/common';

import { BloodStockService } from './blood-stock.service';
import { BloodStockResponseDto } from './dto/blood-stock-response.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { StockAuditResponseDto } from './dto/stock-audit-response.dto';

@Controller('blood-stock')
export class BloodStockController {
  constructor(private readonly bloodStockService: BloodStockService) {}

  @Get()
  async findAll(): Promise<BloodStockResponseDto[]> {
    return this.bloodStockService.findAll();
  }

  @Get('chart')
  async getChartData() {
    return this.bloodStockService.getChartData();
  }

  @Get('audit')
  async getAuditLog(
    @Query('stockId') stockId?: string,
  ): Promise<StockAuditResponseDto[]> {
    return this.bloodStockService.getAuditLog(
      stockId ? Number(stockId) : undefined,
    );
  }

  @Get('stream')
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

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStockDto,
  ): Promise<BloodStockResponseDto> {
    return this.bloodStockService.updateStock(id, dto);
  }

  @Post('sync')
  async sync(): Promise<{ message: string }> {
    await this.bloodStockService.syncStock();
    return { message: 'Stock sincronizado correctamente' };
  }
}
