import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Campaign } from './entities/campaign.entity';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { CampaignResponseDto } from './dto/campaign-response.dto';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
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
