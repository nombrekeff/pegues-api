import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRouteInput } from 'src/resolvers/route/dto/create-route.input';
import { UpdateRouteInput } from 'src/resolvers/route/dto/update-route.input';

@Injectable()
export class RoutesService {
  private readonly logger = new Logger('routes');

  constructor(private prisma: PrismaService) {}

  getRoutesForUser(userId: string) {
    return this.prisma.route.findMany({
      where: {
        authorId: userId,
      },
      include: {
        zone: true,
      },
    });
  }

  async createRoute(userId: string, routeData: CreateRouteInput) {
    return await this.prisma.route.create({
      data: {
        authorId: userId,
        ...routeData,
      },
    });
  }

  async updateRoute(id: string, routeData: UpdateRouteInput) {
    try {
      const route = await this.prisma.route.update({
        where: {
          id: id,
        },
        data: { ...routeData },
      });
      return route;
    } catch (e) {
      throw new Error(e);
    }
  }
}
