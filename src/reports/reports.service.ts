import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { GetEstimateDto } from './dtos/get-estimate.dto';
import { Report } from './reports.entity';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  createReport(reportData: CreateReportDto, user: User) {
    const report = this.repo.create(reportData);
    report.user = user;
    return this.repo.save(report);
  }

  async changeApproval(id: number) {
    const report = (await this.repo.findOneBy({ id })) as Report;
    if (!report) {
      throw new NotFoundException('Report not found');
    }
    report.approved = !report.approved;
    return this.repo.save(report);
  }

  createEstimate({ company, model, lng, lat, year, milage }: GetEstimateDto) {
    return this.repo
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('approved IS TRUE')
      .andWhere('company = :company', { company: company })
      .andWhere('model = :model', { model: model })
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng: lng })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat: lat })
      .andWhere('year - :year BETWEEN -3 AND 3', { year: year - 1 })
      .orderBy('ABS(milage - :milage)', 'DESC')
      .setParameters({ milage })
      .limit(3)
      .getRawOne();
  }
}
