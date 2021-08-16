import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
export interface HttpResponse<T> {
  code: HttpStatus;
  data: T;
  message: string;
}

export class HttpResponse<T = any> implements HttpResponse {
  static ok<T>(data?: T, message: string = ''): HttpResponse<T> {
    return new HttpResponse(HttpStatus.OK, data, message);
  }

  @ApiProperty()
  code: HttpStatus;

  @ApiProperty()
  data: T;

  @ApiProperty()
  message: string;

  constructor(code: HttpStatus, data: T, message: string) {
    this.code = code;
    this.data = data;
    this.message = message;
  }
}
