import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BloodType } from '../donors/entities/blood-type.entity';
import { Campaign } from '../campaigns/entities/campaign.entity';

@Injectable()
export class PublicService {
  constructor(
    @InjectRepository(BloodType)
    private readonly bloodTypeRepo: Repository<BloodType>,
    @InjectRepository(Campaign)
    private readonly campaignRepo: Repository<Campaign>,
  ) {}

  async getBloodTypes(): Promise<BloodType[]> {
    return this.bloodTypeRepo.find({ order: { grupo: 'ASC' } });
  }

  async getCampaigns(): Promise<Campaign[]> {
    return this.campaignRepo.find({ order: { fechaInicio: 'DESC' } });
  }
}
