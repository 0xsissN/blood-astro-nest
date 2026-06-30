import { Controller, Get } from '@nestjs/common';

import { PublicService } from './public.service';

@Controller('api')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get('blood-types')
  async getBloodTypes() {
    return this.publicService.getBloodTypes();
  }

  @Get('campaigns')
  async getCampaigns() {
    return this.publicService.getCampaigns();
  }
}
