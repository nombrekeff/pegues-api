import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginData } from 'src/models/dto/login.dto';
import { Token } from 'src/models/token.model';
import { AuthService } from 'src/services/auth.service';
import { AppService } from '../services/app.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly appService: AppService,
    private readonly auth: AuthService
  ) {}

  @Post('login')
  async login(@Body() { email, password }: LoginData): Promise<Token> {
    const resp = await this.auth.login(email.toLowerCase(), password);

    return resp;
  }
}
