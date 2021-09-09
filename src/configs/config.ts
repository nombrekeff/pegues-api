import { Config } from './config.interface';

export const config: Config = {
  env: 'pre',
  docsUrl: 'https://mis-pegues.com/api',
  defaults: {
    defaultPaginationTake: 15,
  },
  nest: {
    port: 3000,
  },
  cors: {
    enabled: true,
  },
  swagger: {
    enabled: true,
    title: 'Pegues API',
    description: 'Pegues API description, list of requests, models, etc...',
    version: '1.5',
    path: 'api',
  },
  graphql: {
    playgroundEnabled: true,
    debug: true,
    schemaDestination: './src/schema.graphql',
    sortSchema: true,
  },
  security: {
    expiresIn: '1h',
    refreshIn: '7d',
    bcryptSaltOrRound: 10,
  },
};

export default (): Config => config;
