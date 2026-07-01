import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { DonationsService } from './donations.service';
import { CreateDonationDto } from './dto/create-donation.dto';
import { FilterDonationDto } from './dto/filter-donation.dto';
import { DonationResponseDto } from './dto/donation-response.dto';

@Controller('donations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  @Post()
  @Roles('ADMIN', 'MEDICO')
  async create(@Body() createDonationDto: CreateDonationDto) {
    return this.donationsService.create(createDonationDto);
  }

  @Get()
  @Roles('ADMIN', 'MEDICO', 'LABORISTA')
  async findAll(@Query() filterDto: FilterDonationDto) {
    return this.donationsService.findAll(filterDto);
  }

  @Get('stats/monthly')
  @Roles('ADMIN', 'MEDICO')
  async getMonthlyStats(@Query('year') year: string) {
    const yearNum = year ? parseInt(year, 10) : new Date().getFullYear();
    return this.donationsService.getMonthlyStats(yearNum);
  }

  @Get('stats/recurring-donors')
  @Roles('ADMIN', 'MEDICO')
  async getRecurringDonors(
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
  ) {
    return this.donationsService.getRecurringDonors(fechaInicio, fechaFin);
  }

  @Get('donor/:id')
  @Roles('ADMIN', 'MEDICO')
  async findByDonor(
    @Param('id', ParseIntPipe) id: number,
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
  ): Promise<DonationResponseDto[]> {
    return this.donationsService.findByDonor(id, fechaInicio, fechaFin);
  }

  @Get(':id')
  @Roles('ADMIN', 'MEDICO', 'LABORISTA')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.donationsService.findOne(id);
  }
}
