import { ValidZoneSortParams } from './../zone.model';
import { ArgsType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { QueryAllArgs } from './query-all.args';

@ArgsType()
export class ZoneQueryArgs extends QueryAllArgs<ValidZoneSortParams> {
    @IsString()
    @IsOptional()
    routeId?: string;
}
