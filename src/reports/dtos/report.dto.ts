import { Expose, Transform } from 'class-transformer';

export class ReportDto {
  @Expose()
  price: number;

  @Expose()
  milage: number;

  @Expose()
  company: string;

  @Expose()
  model: string;

  @Expose()
  year: number;

  @Expose()
  lng: number;

  @Expose()
  lat: number;

  @Transform(({ obj }) => obj.user.id)
  @Expose()
  userId: number;
}
