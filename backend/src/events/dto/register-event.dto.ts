import { IsInt, IsNotEmpty } from 'class-validator';

export class RegisterEventDto {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsInt()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsNotEmpty()
  memberId: number;
}
