import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRouteInput } from 'src/resolvers/route/dto/create-route.input';

@Injectable()
export class RoutesService {
  constructor(private prisma: PrismaService) {}

  getRoutesForUser(userId: string) {
    return this.prisma.route.findMany({
      where: {
        authorId: userId,
      },
      include: {
       zone: true,
      }
    });
  }

  async createRoute(userId: string, routeData: CreateRouteInput) {
    try {
      const route = await this.prisma.route.create({
        data: {
          name: routeData.name,
          zoneId: routeData.zoneId,
          authorId: userId,
        },
      });
      return route;
    } catch (e) {
      throw new Error(e);
    }
  }
}
