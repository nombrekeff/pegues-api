import { AscentModule } from './resolvers/ascent/ascent.module';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthModule } from './resolvers/auth/auth.module';
import { UserModule } from './resolvers/user/user.module';
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
import { join } from 'path';
import { SessionModule } from './resolvers/session/session.module';
import { SessionsController } from './controllers/sessions.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    AuthModule,
    UserModule,
    ZoneModule,
    RouteModule,
    AscentModule,
    SessionModule,
    UserPreferencesModule,
  ],
  controllers: [
    AuthController,
    UserController,
    ZonesController,
    RoutesController,
    AscentController,
    SessionsController,
    UserPreferencesController,
  ],
  providers: [
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
