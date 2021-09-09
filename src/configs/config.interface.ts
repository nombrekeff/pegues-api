import { SortOrder } from 'src/types';

export interface Config {
  env: 'pre' | 'prod';
  defaults: DefaultsConfig;
  nest: NestConfig;
  cors: CorsConfig;
  swagger: SwaggerConfig;
  graphql: GraphqlConfig;
  security: SecurityConfig;
  docsUrl: string;
}

export interface DefaultsConfig {
  defaultPaginationTake: number;
  sortBy: string;
  sortDir: SortOrder;
}

export interface NestConfig {
  port: number;
}

export interface CorsConfig {
  enabled: boolean;
}

export interface SwaggerConfig {
  enabled: boolean;
  title: string;
  description: string;
  version: string;
  path: string;
}

export interface GraphqlConfig {
  playgroundEnabled: boolean;
  debug: boolean;
  schemaDestination: string;
  sortSchema: boolean;
}

export interface SecurityConfig {
  expiresIn: string;
  refreshIn: string;
  bcryptSaltOrRound: string | number;
}
