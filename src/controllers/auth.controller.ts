import { MailerService } from '@nestjs-modules/mailer';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginData } from 'src/models/dto/login.dto';
import { RefreshData } from 'src/models/dto/refresh.dto';
import { ValidateEmailData } from 'src/models/dto/validate_email.dto';
import { Token } from 'src/models/token.model';
import { SignupInput } from 'src/resolvers/auth/dto/signup.input';
import { ValidateEmailInput } from 'src/resolvers/auth/dto/validate_email.input';
import { AuthService } from 'src/services/auth.service';
import { MailingService } from 'src/services/mailing.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly mailService: MailingService
  ) {}

  @Post('login')
  async login(@Body() { email, password }: LoginData): Promise<Token> {
    return this.auth.login(email.toLowerCase(), password);
  }

  @Post('refresh')
  async refresh(@Body() { refreshToken }: RefreshData): Promise<Token> {
    return this.auth.refreshToken(refreshToken);
  }

  @Post('signup')
  async signup(@Body() data: SignupInput): Promise<Token> {
    return this.auth.createUser(data).then(async (res) => {
      this.auth.sendWelcomeEmail(data);
      return res;
    });
  }

  @Post('validate_email')
  async validateEmail(@Body() data: ValidateEmailData) {
    return this.auth.validateEmail(data);
  }

  @Post('send_validation_email')
  async sendValidationEmail(@Body() data: ValidateEmailInput) {
    return this.auth.sendWelcomeEmail(data);
  }
}
