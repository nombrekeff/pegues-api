import { Injectable } from '@nestjs/common';
import { Grade, RouteDiscipline, ZoneType } from '@prisma/client';
import { BaseService } from './base.service';

@Injectable()
export class SystemService extends BaseService {
  getConfig() {
    return { 
        zoneTypes: Object.keys(ZoneType),
        routeDisciplines: Object.keys(RouteDiscipline),
        grades: Object.keys(Grade),
     };
  }
}
