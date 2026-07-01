import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DashboardReport } from './entities/dashboard-report.entity';
import { Donation } from '../donations/entities/donation.entity';
import { Donor } from '../donors/entities/donor.entity';
import { BloodStock } from '../blood-stock/entities/blood-stock.entity';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([DashboardReport, Donation, Donor, BloodStock]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
