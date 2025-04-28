import { IsEmail, IsString, IsOptional } from 'class-validator';

export class CreateMemberDto {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsEmail()
  email!: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsString()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsOptional()
  name?: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsString()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsOptional()
  discordId?: string;
}
