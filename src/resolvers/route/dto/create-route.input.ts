import { IsNotEmpty } from 'class-validator';

export class CreateRouteInput {
  @IsNotEmpty()
  name: string;

  zoneId: string;
}
