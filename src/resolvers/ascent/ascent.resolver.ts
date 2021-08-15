import { PrismaService } from '../../prisma/prisma.service';
import { GqlAuthGuard } from '../../guards/gql-auth.guard';
import {
  Resolver,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Ascent } from 'src/models/ascent.model';

@Resolver((of) => Ascent)
@UseGuards(GqlAuthGuard)
export class AscentResolver {
  constructor(
    private prisma: PrismaService
  ) {}
}
