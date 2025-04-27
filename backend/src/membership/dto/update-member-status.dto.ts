import { IsString, IsIn } from 'class-validator';

export class UpdateMemberStatusDto {
  @IsString()
  @IsIn(['current', 'lapsed', 'non-member', 'pending'])
  status: string;
}
