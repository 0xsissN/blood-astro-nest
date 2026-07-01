import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AlertsService } from './alerts.service';
import { AlertsController } from './alerts.controller';
import { StockAlert } from './entities/stock-alert.entity';
import { BloodStock } from '../blood-stock/entities/blood-stock.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StockAlert, BloodStock])],
  controllers: [AlertsController],
  providers: [AlertsService],
  exports: [AlertsService],
})
export class AlertsModule {}
