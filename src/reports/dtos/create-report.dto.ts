import {
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateReportDto {
  @IsNumber()
  @Min(0)
  @Max(10000000)
  price: number;

  @IsNumber()
  @Min(0)
  @Max(1000000)
  milage: number;

  @IsString()
  company: string;

  @IsString()
  model: string;

  @IsNumber()
  @Min(1930)
  @Max(2100)
  year: number;

  @IsLongitude()
  lng: number;

  @IsLatitude()
  lat: number;
}
