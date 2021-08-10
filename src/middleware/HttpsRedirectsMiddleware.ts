import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

@Injectable()
export class HttpsRedirectMiddleware implements NestMiddleware {
  constructor(private readonly config: ConfigService) {}

  use(req: Request, res: Response, next: () => void) {
    if (process.env.PRODUCTION || this.config.get<String>('env') == 'prod') {
      if (!req.secure) {
        const httpsUrl = `https://${req.hostname}${req.originalUrl}`;
        res.redirect(HttpStatus.PERMANENT_REDIRECT, httpsUrl);
      } else {
        next();
      }
    }
  }
}
