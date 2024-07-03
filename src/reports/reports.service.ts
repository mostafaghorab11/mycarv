import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
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
}
