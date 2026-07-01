import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

import { BloodStockService } from './blood-stock.service';
import { BloodStockController } from './blood-stock.controller';
import { BloodStock } from './entities/blood-stock.entity';
import { BloodType } from './entities/blood-type.entity';
import { BloodUnit } from '../donations/entities/blood-unit.entity';
import { StockAudit } from './entities/stock-audit.entity';
import { AlertsModule } from '../alerts/alerts.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([BloodStock, BloodType, BloodUnit, StockAudit]),
    AlertsModule,
  ],
  controllers: [BloodStockController],
  providers: [BloodStockService],
})
export class BloodStockModule {}
