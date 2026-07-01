import { Controller, Get, Post, Body, Res } from '@nestjs/common';
import type { Response } from 'express';

import { ReportsService, InventoryReportData } from './reports.service';
import { GenerateReportDto } from './dto/generate-report.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  async generateReport(@Body() dto: GenerateReportDto) {
    return this.reportsService.generateReport(dto);
  }

  @Post('pdf')
  async generatePdf(@Body() dto: GenerateReportDto, @Res() res: Response) {
    const result = await this.reportsService.generatePdf(dto);

    res.set({
      'Content-Type': result.contentType,
      'Content-Disposition': `attachment; filename="${result.filename}"`,
    });

    res.send(result.content);
  }

  @Get('inventory')
  async generateInventoryReport(): Promise<InventoryReportData> {
    return this.reportsService.generateInventoryReport();
  }

  @Get('inventory/pdf')
  async generateInventoryPdf(@Res() res: Response) {
    const pdfBuffer = await this.reportsService.generateInventoryPdf();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="reporte-inventario.pdf"`,
    });

    res.send(pdfBuffer);
  }
}
