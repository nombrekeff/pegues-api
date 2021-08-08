import { PrismaService } from '../../prisma/prisma.service';
import { GqlAuthGuard } from '../../guards/gql-auth.guard';
import {
  Resolver,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Route } from 'src/models/route.model';

@Resolver((of) => Route)
@UseGuards(GqlAuthGuard)
export class RouteResolver {
  constructor(
    private prisma: PrismaService
  ) {}
}
