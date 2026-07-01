import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import PDFDocument from 'pdfkit';

import { DashboardReport } from './entities/dashboard-report.entity';
import { Donation } from '../donations/entities/donation.entity';
import { Donor } from '../donors/entities/donor.entity';
import { BloodStock } from '../blood-stock/entities/blood-stock.entity';
import { GenerateReportDto } from './dto/generate-report.dto';

interface TotalMlRaw {
  total: string | null;
}

interface BloodTypeStatRaw {
  grupo: string;
  factorRh: string;
  cantidad: string;
  totalMl: string;
}

interface StatusStatRaw {
  estado: string;
  cantidad: string;
}

export interface ReportData {
  id: number;
  periodo: string;
  fechaGeneracion: Date;
  resumen: {
    totalDonaciones: number;
    totalMlDonados: number;
    donantesActivos: number;
    donantesRecurrentes: number;
    gruposCriticos: number;
  };
  porTipoSangre: Array<{
    grupo: string;
    factorRh: string;
    cantidadDonaciones: number;
    totalMl: number;
  }>;
  porEstado: Array<{
    estado: string;
    cantidad: number;
  }>;
  inventario: Array<{
    tipoSangre: string;
    unidades: number;
    estado: string | null;
  }>;
}

export interface InventoryReportItem {
  tipoSangre: string;
  grupo: string;
  factorRh: string;
  unidades: number;
  nivelCritico: number;
  estado: string | null;
}

export interface InventoryReportData {
  fechaGeneracion: Date;
  totalUnidades: number;
  gruposCriticos: number;
  gruposBajo: number;
  items: InventoryReportItem[];
}

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(DashboardReport)
    private readonly reportRepository: Repository<DashboardReport>,
    @InjectRepository(Donation)
    private readonly donationRepository: Repository<Donation>,
    @InjectRepository(Donor)
    private readonly donorRepository: Repository<Donor>,
    @InjectRepository(BloodStock)
    private readonly bloodStockRepository: Repository<BloodStock>,
  ) {}

  async generateReport(dto: GenerateReportDto): Promise<ReportData> {
    const fechaInicio = dto.fechaInicio || this.getFirstDayOfMonth();
    const fechaFin = dto.fechaFin || this.getLastDayOfMonth();

    const totalDonations = await this.donationRepository
      .createQueryBuilder('donacion')
      .where('donacion.fecha_donacion BETWEEN :inicio AND :fin', {
        inicio: fechaInicio,
        fin: fechaFin,
      })
      .getCount();

    const totalMl = await this.donationRepository
      .createQueryBuilder('donacion')
      .select('SUM(donacion.cantidad_ml)', 'total')
      .where('donacion.fecha_donacion BETWEEN :inicio AND :fin', {
        inicio: fechaInicio,
        fin: fechaFin,
      })
      .getRawOne<TotalMlRaw>();

    const donationsByBloodType = await this.donationRepository
      .createQueryBuilder('donacion')
      .leftJoin('donacion.tipoSangre', 'tipoSangre')
      .select('tipoSangre.grupo', 'grupo')
      .addSelect('tipoSangre.factor_rh', 'factorRh')
      .addSelect('COUNT(donacion.id)', 'cantidad')
      .addSelect('SUM(donacion.cantidad_ml)', 'totalMl')
      .where('donacion.fecha_donacion BETWEEN :inicio AND :fin', {
        inicio: fechaInicio,
        fin: fechaFin,
      })
      .groupBy('tipoSangre.grupo')
      .addGroupBy('tipoSangre.factor_rh')
      .getRawMany<BloodTypeStatRaw>();

    const donationsByStatus = await this.donationRepository
      .createQueryBuilder('donacion')
      .select('donacion.estado', 'estado')
      .addSelect('COUNT(donacion.id)', 'cantidad')
      .where('donacion.fecha_donacion BETWEEN :inicio AND :fin', {
        inicio: fechaInicio,
        fin: fechaFin,
      })
      .groupBy('donacion.estado')
      .getRawMany<StatusStatRaw>();

    const activeDonors = await this.donorRepository.count({
      where: { activo: true },
    });

    const bloodStock = await this.bloodStockRepository.find({
      relations: ['tipoSangre'],
    });

    const report = this.reportRepository.create({
      periodo: `${fechaInicio} al ${fechaFin}`,
      totalDonaciones: totalDonations,
      donantesRecurrentes: 0,
      gruposCriticos: bloodStock.filter((s) => s.estadoStock === 'critico')
        .length,
    });

    await this.reportRepository.save(report);

    return {
      id: report.id,
      periodo: report.periodo,
      fechaGeneracion: report.fechaGeneracion,
      resumen: {
        totalDonaciones: totalDonations,
        totalMlDonados: Number(totalMl?.total || 0),
        donantesActivos: activeDonors,
        donantesRecurrentes: report.donantesRecurrentes,
        gruposCriticos: report.gruposCriticos,
      },
      porTipoSangre: donationsByBloodType.map((d) => ({
        grupo: d.grupo,
        factorRh: d.factorRh,
        cantidadDonaciones: Number(d.cantidad),
        totalMl: Number(d.totalMl),
      })),
      porEstado: donationsByStatus.map((d) => ({
        estado: d.estado,
        cantidad: Number(d.cantidad),
      })),
      inventario: bloodStock.map((s) => ({
        tipoSangre: `${s.tipoSangre.grupo}${s.tipoSangre.factorRh}`,
        unidades: s.cantidadUnidades,
        estado: s.estadoStock,
      })),
    };
  }

  async generateInventoryReport(): Promise<InventoryReportData> {
    const stocks = await this.bloodStockRepository.find({
      relations: ['tipoSangre'],
      order: { id: 'ASC' },
    });

    const items: InventoryReportItem[] = stocks.map((s) => ({
      tipoSangre: `${s.tipoSangre.grupo}${s.tipoSangre.factorRh}`,
      grupo: s.tipoSangre.grupo,
      factorRh: s.tipoSangre.factorRh,
      unidades: s.cantidadUnidades,
      nivelCritico: s.tipoSangre.nivelCritico,
      estado: s.estadoStock,
    }));

    return {
      fechaGeneracion: new Date(),
      totalUnidades: items.reduce((sum, i) => sum + i.unidades, 0),
      gruposCriticos: items.filter((i) => i.estado === 'critico').length,
      gruposBajo: items.filter((i) => i.estado === 'bajo').length,
      items,
    };
  }

  async generatePdf(dto: GenerateReportDto) {
    const reportData = await this.generateReport(dto);
    const pdfBuffer = await this.buildPdfReport(reportData);

    return {
      filename: `reporte-donaciones-${reportData.periodo.replace(/\s/g, '-')}.pdf`,
      content: pdfBuffer,
      contentType: 'application/pdf',
    };
  }

  async generateInventoryPdf(): Promise<Buffer> {
    const data = await this.generateInventoryReport();

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const pageWidth = doc.page.width - 100;
      const leftX = 50;
      let y = 50;

      const statusColor = (estado: string | null): string => {
        if (estado === 'critico') return '#dc3545';
        if (estado === 'bajo') return '#ffc107';
        return '#28a745';
      };

      doc.fontSize(22).font('Helvetica-Bold').fillColor('#d32f2f');
      doc.text('Reporte de Inventario - Banco de Sangre', leftX, y, {
        align: 'center',
      });
      y += 35;

      doc.fontSize(10).font('Helvetica').fillColor('#666');
      doc.text(
        `Generado: ${data.fechaGeneracion.toLocaleDateString('es-BO', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`,
        leftX,
        y,
        { align: 'center' },
      );
      y += 30;

      doc.moveTo(leftX, y).lineTo(leftX + pageWidth, y).strokeColor('#d32f2f').stroke();
      y += 20;

      doc.fontSize(14).font('Helvetica-Bold').fillColor('#333');
      doc.text('Resumen', leftX, y);
      y += 20;

      doc.fontSize(11).font('Helvetica').fillColor('#333');
      doc.text(`Total de unidades disponibles: ${data.totalUnidades}`, leftX + 20, y);
      y += 16;
      doc.text(`Grupos críticos: ${data.gruposCriticos}`, leftX + 20, y);
      y += 16;
      doc.text(`Grupos con stock bajo: ${data.gruposBajo}`, leftX + 20, y);
      y += 30;

      doc.moveTo(leftX, y).lineTo(leftX + pageWidth, y).strokeColor('#ccc').stroke();
      y += 15;

      doc.fontSize(14).font('Helvetica-Bold').fillColor('#333');
      doc.text('Inventario por Tipo de Sangre', leftX, y);
      y += 22;

      const colTipo = leftX;
      const colUnidades = leftX + 120;
      const colUmbral = leftX + 200;
      const colEstado = leftX + 280;

      doc.fontSize(10).font('Helvetica-Bold').fillColor('#fff');
      doc.roundedRect(leftX, y, pageWidth, 18, 3).fill('#d32f2f');
      doc.fillColor('#fff');
      doc.text('Tipo', colTipo + 5, y + 4);
      doc.text('Unidades', colUnidades, y + 4);
      doc.text('Umbral Crítico', colUmbral, y + 4);
      doc.text('Estado', colEstado, y + 4);
      y += 22;

      for (const item of data.items) {
        if (y > doc.page.height - 80) {
          doc.addPage();
          y = 50;
        }

        doc.fontSize(10).font('Helvetica').fillColor('#333');
        doc.text(item.tipoSangre, colTipo + 5, y + 2);
        doc.text(String(item.unidades), colUnidades, y + 2);
        doc.text(String(item.nivelCritico), colUmbral, y + 2);

        doc.fontSize(9).font('Helvetica-Bold').fillColor(statusColor(item.estado));
        const estadoLabel =
          item.estado === 'critico'
            ? 'CRÍTICO'
            : item.estado === 'bajo'
              ? 'BAJO'
              : 'NORMAL';
        doc.text(estadoLabel, colEstado, y + 2);

        y += 18;
      }

      y += 15;
      if (y > doc.page.height - 80) {
        doc.addPage();
        y = 50;
      }

      doc.moveTo(leftX, y).lineTo(leftX + pageWidth, y).strokeColor('#d32f2f').stroke();
      y += 15;

      doc.fontSize(9).font('Helvetica').fillColor('#999');
      doc.text(
        'Leyenda:  CRÍTICO = requiere acción inmediata  |  BAJO = monitorear  |  NORMAL = stock suficiente',
        leftX,
        y,
        { align: 'center' },
      );

      doc.end();
    });
  }

  private buildPdfReport(data: ReportData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const pageWidth = doc.page.width - 100;
      const leftX = 50;
      let y = 50;

      doc.fontSize(22).font('Helvetica-Bold').fillColor('#d32f2f');
      doc.text('Reporte de Donaciones', leftX, y, { align: 'center' });
      y += 30;

      doc.fontSize(10).font('Helvetica').fillColor('#666');
      doc.text(`Periodo: ${data.periodo}`, leftX, y, { align: 'center' });
      y += 14;
      doc.text(
        `Generado: ${new Date(data.fechaGeneracion).toLocaleDateString('es-BO', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`,
        leftX,
        y,
        { align: 'center' },
      );
      y += 25;

      doc.moveTo(leftX, y).lineTo(leftX + pageWidth, y).strokeColor('#d32f2f').stroke();
      y += 20;

      doc.fontSize(14).font('Helvetica-Bold').fillColor('#333');
      doc.text('Resumen', leftX, y);
      y += 20;

      doc.fontSize(11).font('Helvetica').fillColor('#333');
      const summaryItems = [
        `Total de Donaciones: ${data.resumen.totalDonaciones}`,
        `Total ml Donados: ${data.resumen.totalMlDonados} ml`,
        `Donantes Activos: ${data.resumen.donantesActivos}`,
        `Grupos Críticos: ${data.resumen.gruposCriticos}`,
      ];
      for (const item of summaryItems) {
        doc.text(item, leftX + 20, y);
        y += 16;
      }
      y += 15;

      doc.moveTo(leftX, y).lineTo(leftX + pageWidth, y).strokeColor('#ccc').stroke();
      y += 15;

      doc.fontSize(14).font('Helvetica-Bold').fillColor('#333');
      doc.text('Inventario Actual', leftX, y);
      y += 22;

      const colInvTipo = leftX;
      const colInvUnid = leftX + 120;
      const colInvEstado = leftX + 200;

      doc.fontSize(10).font('Helvetica-Bold').fillColor('#fff');
      doc.roundedRect(leftX, y, pageWidth, 18, 3).fill('#d32f2f');
      doc.fillColor('#fff');
      doc.text('Tipo', colInvTipo + 5, y + 4);
      doc.text('Unidades', colInvUnid, y + 4);
      doc.text('Estado', colInvEstado, y + 4);
      y += 22;

      for (const item of data.inventario) {
        if (y > doc.page.height - 80) {
          doc.addPage();
          y = 50;
        }
        doc.fontSize(10).font('Helvetica').fillColor('#333');
        doc.text(item.tipoSangre, colInvTipo + 5, y + 2);
        doc.text(String(item.unidades), colInvUnid, y + 2);
        doc
          .fontSize(9)
          .font('Helvetica-Bold')
          .fillColor(
            item.estado === 'critico'
              ? '#dc3545'
              : item.estado === 'bajo'
                ? '#ffc107'
                : '#28a745',
          );
        doc.text(
          item.estado === 'critico'
            ? 'CRÍTICO'
            : item.estado === 'bajo'
              ? 'BAJO'
              : 'NORMAL',
          colInvEstado,
          y + 2,
        );
        y += 18;
      }

      y += 15;
      if (y > doc.page.height - 80) {
        doc.addPage();
        y = 50;
      }

      doc.fontSize(14).font('Helvetica-Bold').fillColor('#333');
      doc.text('Donaciones por Tipo de Sangre', leftX, y);
      y += 22;

      const colBt = leftX;
      const colCant = leftX + 120;
      const colMl = leftX + 230;

      doc.fontSize(10).font('Helvetica-Bold').fillColor('#fff');
      doc.roundedRect(leftX, y, pageWidth, 18, 3).fill('#d32f2f');
      doc.fillColor('#fff');
      doc.text('Tipo', colBt + 5, y + 4);
      doc.text('Cantidad', colCant, y + 4);
      doc.text('Total ml', colMl, y + 4);
      y += 22;

      for (const item of data.porTipoSangre) {
        if (y > doc.page.height - 80) {
          doc.addPage();
          y = 50;
        }
        doc.fontSize(10).font('Helvetica').fillColor('#333');
        doc.text(`${item.grupo}${item.factorRh}`, colBt + 5, y + 2);
        doc.text(String(item.cantidadDonaciones), colCant, y + 2);
        doc.text(`${item.totalMl} ml`, colMl, y + 2);
        y += 18;
      }

      if (y > doc.page.height - 80) {
        doc.addPage();
        y = 50;
      }

      doc.fontSize(14).font('Helvetica-Bold').fillColor('#333');
      doc.text('Donaciones por Estado', leftX, y);
      y += 22;

      const colEst = leftX;
      const colEstCant = leftX + 120;

      doc.fontSize(10).font('Helvetica-Bold').fillColor('#fff');
      doc.roundedRect(leftX, y, pageWidth, 18, 3).fill('#d32f2f');
      doc.fillColor('#fff');
      doc.text('Estado', colEst + 5, y + 4);
      doc.text('Cantidad', colEstCant, y + 4);
      y += 22;

      for (const item of data.porEstado) {
        if (y > doc.page.height - 80) {
          doc.addPage();
          y = 50;
        }
        doc.fontSize(10).font('Helvetica').fillColor('#333');
        doc.text(item.estado, colEst + 5, y + 2);
        doc.text(String(item.cantidad), colEstCant, y + 2);
        y += 18;
      }

      doc.end();
    });
  }

  private getFirstDayOfMonth(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
  }

  private getLastDayOfMonth(): string {
    const now = new Date();
    const lastDay = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
    ).getDate();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
  }
}
