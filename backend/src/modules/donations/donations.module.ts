import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Donation } from './entities/donation.entity';
import { BloodUnit } from './entities/blood-unit.entity';
import { BloodStock } from './entities/blood-stock.entity';
import { Donor } from '../donors/entities/donor.entity';
import { BloodType } from '../donors/entities/blood-type.entity';
import { DonationsService } from './donations.service';
import { DonationsController } from './donations.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Donation,
      BloodUnit,
      BloodStock,
      Donor,
      BloodType,
    ]),
  ],
  controllers: [DonationsController],
  providers: [DonationsService],
  exports: [DonationsService],
})
export class DonationsModule {}
