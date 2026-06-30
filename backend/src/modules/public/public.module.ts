import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BloodType } from '../donors/entities/blood-type.entity';
import { Campaign } from '../campaigns/entities/campaign.entity';
import { PublicController } from './public.controller';
import { PublicService } from './public.service';

@Module({
  imports: [TypeOrmModule.forFeature([BloodType, Campaign])],
  controllers: [PublicController],
  providers: [PublicService],
})
export class PublicModule {}
