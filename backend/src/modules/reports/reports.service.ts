import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DashboardReport } from './entities/dashboard-report.entity';
import { Donation } from '../donations/entities/donation.entity';
import { Donor } from '../donors/entities/donor.entity';
import { BloodStock } from '../donations/entities/blood-stock.entity';
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

  async generatePdf(dto: GenerateReportDto) {
    const reportData = await this.generateReport(dto);

    const pdfContent = this.buildPdfContent(reportData);

    return {
      filename: `reporte-donaciones-${reportData.periodo.replace(/\s/g, '-')}.pdf`,
      content: pdfContent,
      contentType: 'application/pdf',
    };
  }

  private buildPdfContent(data: ReportData): string {
    const bloodTypeRows = data.porTipoSangre
      .map(
        (item) => `
        <tr>
          <td>${item.grupo}${item.factorRh}</td>
          <td>${item.cantidadDonaciones}</td>
          <td>${item.totalMl} ml</td>
        </tr>
      `,
      )
      .join('');

    const statusRows = data.porEstado
      .map(
        (item) => `
        <tr>
          <td>${item.estado}</td>
          <td>${item.cantidad}</td>
        </tr>
      `,
      )
      .join('');

    const inventoryRows = data.inventario
      .map(
        (item) => `
        <tr>
          <td>${item.tipoSangre}</td>
          <td>${item.unidades}</td>
          <td>${item.estado || 'N/A'}</td>
        </tr>
      `,
      )
      .join('');

    const content = `
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          h1 { color: #d32f2f; text-align: center; }
          h2 { color: #333; border-bottom: 2px solid #d32f2f; padding-bottom: 5px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
          th { background-color: #d32f2f; color: white; }
          tr:nth-child(even) { background-color: #f2f2f2; }
          .summary { background-color: #f5f5f5; padding: 20px; border-radius: 10px; }
          .summary-item { margin: 10px 0; }
          .label { font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>Reporte de Donaciones</h1>
        <p><strong>Periodo:</strong> ${data.periodo}</p>
        <p><strong>Fecha de generación:</strong> ${new Date(data.fechaGeneracion).toLocaleString()}</p>
        
        <div class="summary">
          <h2>Resumen</h2>
          <div class="summary-item"><span class="label">Total de Donaciones:</span> ${data.resumen.totalDonaciones}</div>
          <div class="summary-item"><span class="label">Total ml Donados:</span> ${data.resumen.totalMlDonados} ml</div>
          <div class="summary-item"><span class="label">Donantes Activos:</span> ${data.resumen.donantesActivos}</div>
          <div class="summary-item"><span class="label">Grupos Críticos:</span> ${data.resumen.gruposCriticos}</div>
        </div>

        <h2>Donaciones por Tipo de Sangre</h2>
        <table>
          <tr>
            <th>Tipo de Sangre</th>
            <th>Cantidad Donaciones</th>
            <th>Total ml</th>
          </tr>
          ${bloodTypeRows}
        </table>

        <h2>Donaciones por Estado</h2>
        <table>
          <tr>
            <th>Estado</th>
            <th>Cantidad</th>
          </tr>
          ${statusRows}
        </table>

        <h2>Inventario Actual</h2>
        <table>
          <tr>
            <th>Tipo de Sangre</th>
            <th>Unidades</th>
            <th>Estado</th>
          </tr>
          ${inventoryRows}
        </table>
      </body>
      </html>
    `;

    return content;
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
