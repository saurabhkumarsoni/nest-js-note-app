import { Controller, Get } from '@nestjs/common';
import { StaticDataService } from './static-data.service';

@Controller('api/static')
export class StaticDataController {
  constructor(private readonly service: StaticDataService) {}

  @Get('positions')
  getPositions() {
    return this.service.getPositions();
  }

  @Get('departments')
  getDepartments() {
    return this.service.getDepartments();
  }

  @Get('degrees')
  getDegrees() {
    return this.service.getDegrees();
  }

  @Get('universities')
  getUniversities() {
    return this.service.getUniversities();
  }

  @Get('managers')
  getManagers() {
    return this.service.getManagers();
  }
}
