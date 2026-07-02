import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Campaign } from './entities/campaign.entity';
import { Donation } from '../donations/entities/donation.entity';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { CampaignResponseDto } from './dto/campaign-response.dto';
import { CampaignStatsResponseDto } from './dto/campaign-stats-response.dto';

interface CampaignStatsRaw {
  id: string;
  nombre: string;
  lugar: string;
  fecha_inicio: string;
  fecha_fin: string;
  activa: boolean;
  total_donaciones: string;
  total_ml: string;
}

@Injectable()
export class CampaignsService {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
    @InjectRepository(Donation)
    private readonly donationRepository: Repository<Donation>,
  ) {}

  async create(
    createCampaignDto: CreateCampaignDto,
  ): Promise<CampaignResponseDto> {
    this.validateDates(
      createCampaignDto.fechaInicio,
      createCampaignDto.fechaFin,
    );

    const campaign = this.campaignRepository.create({
      ...createCampaignDto,
      activa: true,
    });

    const saved = await this.campaignRepository.save(campaign);
    return this.toResponseDto(saved);
  }

  async findAll(): Promise<CampaignResponseDto[]> {
    const campaigns = await this.campaignRepository.find({
      order: { fechaInicio: 'DESC' },
      where: { activa: true },
    });
    return campaigns.map((c) => this.toResponseDto(c));
  }

  async findOne(id: number): Promise<CampaignResponseDto> {
    const campaign = await this.campaignRepository.findOne({ where: { id } });

    if (!campaign) {
      throw new NotFoundException(`Campaña con id ${id} no encontrada`);
    }

    return this.toResponseDto(campaign);
  }

  async update(
    id: number,
    updateCampaignDto: Partial<CreateCampaignDto>,
  ): Promise<CampaignResponseDto> {
    const campaign = await this.campaignRepository.findOne({ where: { id } });

    if (!campaign) {
      throw new NotFoundException(`Campaña con id ${id} no encontrada`);
    }

    if (updateCampaignDto.fechaInicio || updateCampaignDto.fechaFin) {
      const fechaInicio = updateCampaignDto.fechaInicio ?? campaign.fechaInicio;
      const fechaFin = updateCampaignDto.fechaFin ?? campaign.fechaFin;
      this.validateDates(fechaInicio, fechaFin);
    }

    Object.assign(campaign, updateCampaignDto);
    const updated = await this.campaignRepository.save(campaign);
    return this.toResponseDto(updated);
  }

  async remove(id: number): Promise<void> {
    const campaign = await this.campaignRepository.findOne({ where: { id } });

    if (!campaign) {
      throw new NotFoundException(`Campaña con id ${id} no encontrada`);
    }

    await this.campaignRepository.remove(campaign);
  }

  async getTopCampaigns(): Promise<CampaignStatsResponseDto[]> {
    const stats = await this.donationRepository
      .createQueryBuilder('donacion')
      .select('campania.id', 'id')
      .addSelect('campania.nombre', 'nombre')
      .addSelect('campania.lugar', 'lugar')
      .addSelect('campania.fecha_inicio', 'fecha_inicio')
      .addSelect('campania.fecha_fin', 'fecha_fin')
      .addSelect('campania.activa', 'activa')
      .addSelect('COUNT(donacion.id)', 'total_donaciones')
      .addSelect('SUM(donacion.cantidad_ml)', 'total_ml')
      .innerJoin('donacion.campania', 'campania')
      .groupBy('campania.id')
      .addGroupBy('campania.nombre')
      .addGroupBy('campania.lugar')
      .addGroupBy('campania.fecha_inicio')
      .addGroupBy('campania.fecha_fin')
      .addGroupBy('campania.activa')
      .orderBy('total_donaciones', 'DESC')
      .getRawMany<CampaignStatsRaw>();

    return stats.map((s) => ({
      id: Number(s.id),
      nombre: s.nombre,
      lugar: s.lugar,
      fechaInicio: s.fecha_inicio,
      fechaFin: s.fecha_fin,
      activa: s.activa,
      totalDonaciones: Number(s.total_donaciones),
      totalMl: Number(s.total_ml),
    }));
  }

  private validateDates(fechaInicio: string, fechaFin: string): void {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    if (fin < inicio) {
      throw new BadRequestException(
        'La fecha de fin no puede ser anterior a la fecha de inicio',
      );
    }
  }

  private toResponseDto(campaign: Campaign): CampaignResponseDto {
    return {
      id: campaign.id,
      nombre: campaign.nombre,
      lugar: campaign.lugar,
      fechaInicio: campaign.fechaInicio,
      fechaFin: campaign.fechaFin,
      activa: campaign.activa,
    };
  }
}
