import { IsOptional, IsString, IsNumber } from 'class-validator';

export class FilterDonationDto {
  @IsOptional()
  @IsString()
  fechaInicio?: string;

  @IsOptional()
  @IsString()
  fechaFin?: string;

  @IsOptional()
  @IsNumber()
  idDonante?: number;

  @IsOptional()
  @IsString()
  estado?: string;
}
