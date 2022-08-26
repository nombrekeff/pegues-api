import { ProjectModule } from './resolvers/project/project.module';
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
import { ProjectController } from './controllers/project.controller';
import { UserPreferencesModule } from './resolvers/user-preferences/user-preferences.module';
import { UserPreferencesController } from './controllers/user-preferences.controller';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';
import { join } from 'path';
import { SessionModule } from './resolvers/session/session.module';
import { SessionsController } from './controllers/sessions.controller';
import { SystemController } from './controllers/system.controller';
import { SystemService } from './services/system.service';
import { SystemModule } from './resolvers/system.module';
import { MediaController } from './controllers/media.controller';
import { MulterModule } from '@nestjs/platform-express';
import { MediaModule } from './resolvers/media.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    AuthModule,
    UserModule,
    ZoneModule,
    RouteModule,
    ProjectModule,
    SessionModule,
    UserPreferencesModule,
    SystemModule,
    MediaModule,
    MulterModule.register({
      dest: './media/upload',
    })
  ],
  controllers: [
    AuthController,
    UserController,
    ZonesController,
    RoutesController,
    ProjectController,
    SessionsController,
    UserPreferencesController,
    SystemController,
    MediaController,
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
