import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Donor } from './entities/donor.entity';
import { BloodType } from './entities/blood-type.entity';
import { DonorsService } from './donors.service';
import { DonorsController } from './donors.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Donor, BloodType])],
  controllers: [DonorsController],
  providers: [DonorsService],
  exports: [DonorsService],
})
export class DonorsModule {}
