import { AscentModule } from './resolvers/ascent/ascent.module';
import { GraphQLModule } from '@nestjs/graphql';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { AuthModule } from './resolvers/auth/auth.module';
import { UserModule } from './resolvers/user/user.module';
import { AppResolver } from './resolvers/app.resolver';
import { DateScalar } from './common/scalars/date.scalar';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';
import { ZoneModule } from './resolvers/zone/zone.module';
import { ZonesController } from './controllers/zones.controller';
import { RouteModule } from './resolvers/route/route.module';
import { RoutesController } from './controllers/route.controller';
import config from './configs/config';
import { HttpsRedirectMiddleware } from './middleware/HttpsRedirectsMiddleware';
import { AscentController } from './controllers/ascent.controller';
import { UserPreferencesModule } from './resolvers/user-preferences/user-preferences.module';
import { UserPreferencesController } from './controllers/user-preferences.controller';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    AuthModule,
    UserModule,
    ZoneModule,
    RouteModule,
    AscentModule,
    UserPreferencesModule,
  ],
  controllers: [
    AppController,
    AuthController,
    UserController,
    ZonesController,
    RoutesController,
    AscentController,
    UserPreferencesController,
  ],
  providers: [
    AppService,
    AppResolver,
    DateScalar,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpsRedirectMiddleware).forRoutes('*');
  }
}
