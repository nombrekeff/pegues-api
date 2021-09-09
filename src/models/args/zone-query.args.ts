import { ValidZoneSortParams } from './../zone.model';

import { IsOptional, IsString } from 'class-validator';
import { QueryAllArgs } from './query-all.args';


export class ZoneQueryArgs extends QueryAllArgs<ValidZoneSortParams> {
    @IsString()
    @IsOptional()
    routeId?: string;
}
