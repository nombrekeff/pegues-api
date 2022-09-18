import { MailerService } from '@nestjs-modules/mailer';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginData } from 'src/models/dto/login.dto';
import { RefreshData } from 'src/models/dto/refresh.dto';
import { Token } from 'src/models/token.model';
import { SignupInput } from 'src/resolvers/auth/dto/signup.input';
import { AuthService } from 'src/services/auth.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly mailerService: MailerService
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
    return this.auth.createUser(data);
  }

  @Post('test')
  example() {
    return this.mailerService
      .sendMail({
        to: 'manoloedge96@gmail.com',
        subject: 'Bienvenido a Pegues!',
        template: 'test',
        context: {
          'code': 'ffssasdasdhaosuydh',
          'user': 'manolo',
          'activate_url': 'https://mis-pegues.com/activate/ffssasdasdhaosuydh'
        } 
      });
  }
}
