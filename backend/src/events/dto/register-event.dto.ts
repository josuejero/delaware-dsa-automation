import { IsInt, IsNotEmpty } from 'class-validator';

export class RegisterEventDto {
  @IsInt()
  @IsNotEmpty()
  memberId: number;
}
