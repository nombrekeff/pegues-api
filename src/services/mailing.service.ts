import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { SendEmailData, WelcomeEmailData } from 'src/models/dto/send_email.dto';
import { BaseService } from './base.service';

@Injectable()
export class MailingService extends BaseService {
  private readonly logger = new Logger(MailingService.name);

  constructor(private readonly mailerService: MailerService) {
    super();
  }

  sendWelcomeEmail(to: string, data: WelcomeEmailData) {
    return this.mailerService.sendMail({
      to,
      subject: 'Bienvenido a Pegues!',
      template: 'welcome',
      context: data,
    });
  }

  sendEmail(data: SendEmailData) {
    return this.mailerService.sendMail({
      to: data.to,
      subject: data.subject,
      template: data.template,
      context: data.context,
    });
  }
}
