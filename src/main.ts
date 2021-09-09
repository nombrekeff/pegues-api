import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { env } from 'process';
import { AppModule } from './app.module';
import {
  CorsConfig,
  NestConfig,
  SwaggerConfig,
} from './configs/config.interface';
const fs = require('fs');

async function bootstrap() {
  let httpsOptions;

  if (env.NODE_ENV == 'production') {
    const keyFile = fs.readFileSync(__dirname + '/../ssl/pegues_com.key');
    const bundleFile = fs.readFileSync(
      __dirname + '/../ssl/mis-pegues_com.ca-bundle'
    );
    const certFile = fs.readFileSync(__dirname + '/../ssl/mis-pegues_com.crt');
    httpsOptions = {
      key: keyFile,
      cert: certFile,
      ca: bundleFile,
    };
  }

  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug'],
    httpsOptions: httpsOptions,
  });

  // Validation
  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(ConfigService);
  const nestConfig = configService.get<NestConfig>('nest');
  const corsConfig = configService.get<CorsConfig>('cors');
  const swaggerConfig = configService.get<SwaggerConfig>('swagger');

  // Swagger Api
  if (swaggerConfig.enabled) {
    const options = new DocumentBuilder()
      .setTitle(swaggerConfig.title || 'Nestjs')
      .setDescription(swaggerConfig.description || 'The nestjs API description')
      .setVersion(swaggerConfig.version || '1.0')
      .build();
    const document = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup(swaggerConfig.path || 'api', app, document, {
      customSiteTitle: 'Pegues API',
      customCssUrl: `/theme-material.css`,
    });
  }

  // Cors
  if (corsConfig.enabled) {
    app.enableCors();
  }

  const port = process.env.PORT || nestConfig.port || 3000;
  await app.listen(port);

  console.log('Listening on port:', port);
}
bootstrap();
