import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from './password.service';
import { SignupInput } from '../resolvers/auth/dto/signup.input';
import { Prisma, User } from '@prisma/client';
import { Token } from '../models/token.model';
import { UserPreferences } from 'src/models/user-preferences.model';
import { BaseService } from './base.service';
import { randomBytes } from 'crypto';
import { ValidateEmailData } from 'src/models/dto/validate_email.dto';
import { HttpResponse } from 'src/common/responses/http_response';
import { ValidateEmailInput } from 'src/resolvers/auth/dto/validate_email.input';
import { MailingService } from './mailing.service';

@Injectable()
export class AuthService extends BaseService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
    private readonly mailService: MailingService
  ) {
    super();
  }

  async createUser(payload: SignupInput): Promise<Token> {
    const hashedPassword = await this.passwordService.hashPassword(
      payload.password
    );

    const code = randomBytes(4).toString('hex');

    try {
      const user = await this.prisma.user.create({
        data: {
          ...payload,
          preferences: {
            create: {
              ...UserPreferences.defaultPrefereneces,
            },
          },
          emailValidated: false,
          emailValidationCode: {
            create: { code },
          },
          password: hashedPassword,
          roles: ['USER'],
        },
      });

      return this.generateTokens({
        userId: user.id,
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException(`Email ${payload.email} already used.`);
      } else {
        throw new Error(e);
      }
    }
  }

  async validateEmail({ code, email }: ValidateEmailData) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user)
      throw new HttpException(
        'No match found for that data',
        HttpStatus.NOT_FOUND
      );

    const validationCode = await this.prisma.validationCode.findUnique({
      where: { authorId: user.id },
    });
    if (validationCode.code != code) {
      throw new HttpException(
        'No match found for that data',
        HttpStatus.NOT_FOUND
      );
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { emailValidated: true },
    });
    await this.prisma.validationCode.delete({
      where: { id: validationCode.id },
    });

    return new HttpResponse(HttpStatus.OK, {}, 'Email validated ok!');
  }

  async login(email: string, password: string): Promise<Token> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    if (!user.emailValidated) {
      throw new HttpException(
        `email is not validated: ${email}`,
        HttpStatus.UNAUTHORIZED
      );
    }

    const passwordValid = await this.passwordService.validatePassword(
      password,
      user.password
    );

    if (!passwordValid) {
      throw new BadRequestException('Invalid password');
    }

    return this.generateTokens({
      userId: user.id,
    });
  }

  async sendWelcomeEmail(data: ValidateEmailInput) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      return new HttpResponse(
        HttpStatus.NOT_FOUND,
        {},
        'User with email ' + data.email + ' not found'
      );
    }

    // If user email is already validated, there is no need to send the email
    if (user.emailValidated) {
      return new HttpResponse(HttpStatus.OK, {}, 'Success');
    }

    const validationCode = await this.prisma.validationCode.findUnique({
      where: { authorId: user.id },
    });

    const result = await this.mailService.sendWelcomeEmail(user.email, {
      code: validationCode.code,
      user: user.firstname ?? user.email,
      activate_url: 'https://mis-pegues.com/activate/' + validationCode.code,
    });

    return new HttpResponse(HttpStatus.OK, {}, 'Email sent correctly');
  }

  validateUser(userId: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  getUserFromToken(token: string): Promise<User> {
    const id = this.jwtService.decode(token)['userId'];
    return this.prisma.user.findUnique({ where: { id } });
  }

  generateTokens(payload: { userId: string }): Token {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  private generateAccessToken(payload: { userId: string }): string {
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(payload: { userId: string }): string {
    return this.jwtService.sign(payload, {
      secret: this.config.get('JWT_REFRESH_SECRET'),
      expiresIn: this.securityConfig.refreshIn,
    });
  }

  refreshToken(token: string) {
    try {
      const { userId } = this.jwtService.verify(token, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
      });

      return this.generateTokens({
        userId,
      });
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
