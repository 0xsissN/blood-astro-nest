import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { DonorsService } from './donors.service';
import { CreateDonorDto } from './dto/create-donor.dto';
import { UpdateDonorDto } from './dto/update-donor.dto';
import { SearchDonorDto } from './dto/search-donor.dto';

@Controller('donors')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DonorsController {
  constructor(private readonly donorsService: DonorsService) {}

  @Post()
  @Roles('ADMIN', 'RECEPCIONISTA')
  async create(@Body() createDonorDto: CreateDonorDto) {
    return this.donorsService.create(createDonorDto);
  }

  @Get()
  @Roles('ADMIN', 'MEDICO', 'RECEPCIONISTA')
  async findAll() {
    return this.donorsService.findAll();
  }

  @Get('search')
  @Roles('ADMIN', 'MEDICO', 'RECEPCIONISTA')
  async search(@Query() searchDto: SearchDonorDto) {
    return this.donorsService.search(searchDto);
  }

  @Get('blood-types')
  @Roles('ADMIN', 'MEDICO', 'RECEPCIONISTA')
  async findAllBloodTypes() {
    return this.donorsService.findAllBloodTypes();
  }

  @Get(':id')
  @Roles('ADMIN', 'MEDICO', 'RECEPCIONISTA')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.donorsService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'RECEPCIONISTA')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDonorDto: UpdateDonorDto,
  ) {
    return this.donorsService.update(id, updateDonorDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.donorsService.remove(id);
  }
}
