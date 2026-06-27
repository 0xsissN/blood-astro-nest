import { IsOptional, IsString } from 'class-validator';

export class SearchDonorDto {
  @IsOptional()
  @IsString()
  query?: string;

  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  ci?: string;

  @IsOptional()
  @IsString()
  tipoSangre?: string;
}
