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
import { SessionModule } from './resolvers/session/session.module';
import { SessionsController } from './controllers/sessions.controller';
import { SystemController } from './controllers/system.controller';
import { SystemModule } from './resolvers/system.module';
import { MediaController } from './controllers/media.controller';
import { MulterModule } from '@nestjs/platform-express';
import { MediaModule } from './resolvers/media.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import path from 'path';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './controllers/tasks.controller';
import { TasksModule } from './resolvers/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    AuthModule,
    UserModule,
    RouteModule,
    ZoneModule,
    ProjectModule,
    SessionModule,
    UserPreferencesModule,
    TasksModule,
    SystemModule,
    MediaModule,
    MulterModule.register({
      dest: './media/upload',
    }),
    ScheduleModule.forRoot(),
    MailerModule.forRoot({
      // transport: 'smtp://info@mis-pegues.com:WrRrKG7XMX6SK3HQ@smtp.mis-pegues.com',
      transport: {
        host: 'mail.privateemail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'info@mis-pegues.com',
          pass: 'WrRrKG7XMX6SK3HQ',
        },
      },
      defaults: {
        from: '"no-reply" <info@mis-pegues.com>',
      },
      preview: false,
      template: {
        dir: path.join(__dirname, '../templates'),
        adapter: new PugAdapter({
          inlineCssEnabled: true,
        }),
        options: {
          strict: true,
        },
      },
    }),
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
