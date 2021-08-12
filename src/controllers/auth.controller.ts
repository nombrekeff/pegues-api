import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginData } from 'src/models/dto/login.dto';
import { RefreshData } from 'src/models/dto/refresh.dto';
import { Token } from 'src/models/token.model';
import { SignupInput } from 'src/resolvers/auth/dto/signup.input';
import { AuthService } from 'src/services/auth.service';
import { AppService } from '../services/app.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

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
}
