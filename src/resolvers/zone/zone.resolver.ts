import { PrismaService } from '../../prisma/prisma.service';
import { GqlAuthGuard } from '../../guards/gql-auth.guard';
import {
  Resolver,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Zone } from 'src/models/zone.model';

@Resolver((of) => Zone)
@UseGuards(GqlAuthGuard)
export class ZoneResolver {
  constructor(
    private prisma: PrismaService
  ) {}
}
