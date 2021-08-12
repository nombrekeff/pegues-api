import {  IsNotEmpty } from 'class-validator';

export class RefreshData {
  @IsNotEmpty()
  refreshToken: string;
}
