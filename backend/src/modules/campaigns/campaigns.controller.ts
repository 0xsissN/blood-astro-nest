import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { CampaignStatsResponseDto } from './dto/campaign-stats-response.dto';

@Controller('campaigns')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Post()
  @Roles('ADMIN')
  async create(@Body() createCampaignDto: CreateCampaignDto) {
    return this.campaignsService.create(createCampaignDto);
  }

  @Get('top')
  @Roles('ADMIN', 'MEDICO')
  async getTopCampaigns(): Promise<CampaignStatsResponseDto[]> {
    return this.campaignsService.getTopCampaigns();
  }

  @Get()
  @Roles('ADMIN', 'MEDICO', 'RECEPCIONISTA')
  async findAll() {
    return this.campaignsService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'MEDICO', 'RECEPCIONISTA')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.campaignsService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCampaignDto: Partial<CreateCampaignDto>,
  ) {
    return this.campaignsService.update(id, updateCampaignDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.campaignsService.remove(id);
    return { message: 'Campaña eliminada exitosamente' };
  }
}
