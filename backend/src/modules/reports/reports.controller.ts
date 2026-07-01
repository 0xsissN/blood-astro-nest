import { Controller, Get, Post, Body, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ReportsService, InventoryReportData } from './reports.service';
import { GenerateReportDto } from './dto/generate-report.dto';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @Roles('ADMIN')
  async generateReport(@Body() dto: GenerateReportDto) {
    return this.reportsService.generateReport(dto);
  }

  @Post('pdf')
  @Roles('ADMIN')
  async generatePdf(@Body() dto: GenerateReportDto, @Res() res: Response) {
    const result = await this.reportsService.generatePdf(dto);

    res.set({
      'Content-Type': result.contentType,
      'Content-Disposition': `attachment; filename="${result.filename}"`,
    });

    res.send(result.content);
  }

  @Get('inventory')
  @Roles('ADMIN', 'LABORATORISTA')
  async generateInventoryReport(): Promise<InventoryReportData> {
    return this.reportsService.generateInventoryReport();
  }

  @Get('inventory/pdf')
  @Roles('ADMIN')
  async generateInventoryPdf(@Res() res: Response) {
    const pdfBuffer = await this.reportsService.generateInventoryPdf();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="reporte-inventario.pdf"`,
    });

    res.send(pdfBuffer);
  }
}
