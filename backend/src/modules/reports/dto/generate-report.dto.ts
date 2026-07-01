import { IsOptional, IsString } from 'class-validator';

export class GenerateReportDto {
  @IsOptional()
  @IsString()
  fechaInicio?: string;

  @IsOptional()
  @IsString()
  fechaFin?: string;

  @IsOptional()
  @IsString()
  tipo?: string;
}
