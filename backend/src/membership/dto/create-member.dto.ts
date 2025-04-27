import { IsEmail, IsString, IsOptional } from 'class-validator';

export class CreateMemberDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  discordId?: string;
}
