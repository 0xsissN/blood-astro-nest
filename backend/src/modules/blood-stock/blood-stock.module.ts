import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BloodStockService } from './blood-stock.service';
import { BloodStockController } from './blood-stock.controller';
import { BloodStock } from './entities/blood-stock.entity';
import { BloodType } from './entities/blood-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BloodStock, BloodType])],
  controllers: [BloodStockController],
  providers: [BloodStockService],
})
export class BloodStockModule {}
