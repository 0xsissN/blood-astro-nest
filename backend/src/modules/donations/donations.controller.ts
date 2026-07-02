import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';

import { DonationsService } from './donations.service';
import { CreateDonationDto } from './dto/create-donation.dto';
import { FilterDonationDto } from './dto/filter-donation.dto';
import { DonationResponseDto } from './dto/donation-response.dto';

@Controller('donations')
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  @Post()
  async create(@Body() createDonationDto: CreateDonationDto) {
    return this.donationsService.create(createDonationDto);
  }

  @Get()
  async findAll(@Query() filterDto: FilterDonationDto) {
    return this.donationsService.findAll(filterDto);
  }

  @Get('stats/monthly')
  async getMonthlyStats(@Query('year') year: string) {
    const yearNum = year ? parseInt(year, 10) : new Date().getFullYear();
    return this.donationsService.getMonthlyStats(yearNum);
  }

  @Get('stats/recurring-donors')
  async getRecurringDonors(
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
  ) {
    return this.donationsService.getRecurringDonors(fechaInicio, fechaFin);
  }

  @Get('donor/:id')
  async findByDonor(
    @Param('id', ParseIntPipe) id: number,
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
  ): Promise<DonationResponseDto[]> {
    return this.donationsService.findByDonor(id, fechaInicio, fechaFin);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.donationsService.findOne(id);
  }
}
