import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateZoneInput } from 'src/resolvers/zone/dto/create-zone.input';

@Injectable()
export class ZonesService {
  constructor(private prisma: PrismaService) {}

  getZonesForUser(userId: string) {
    return this.prisma.zone.findMany({
      where: {
        authorId: userId,
      },
    });
  }

  async createZone(userId: string, zoneData: CreateZoneInput) {
    try {
      const zone = await this.prisma.zone.create({
        data: {
          name: zoneData.name,
          authorId: userId,
        },
      });

      return {
        zone: zone,
      };
    } catch (e) {
      throw new Error(e);
    }
  }
}
