import { ArgsType } from '@nestjs/graphql';

@ArgsType()
export class SearchArgs {
  search?: string;
}
