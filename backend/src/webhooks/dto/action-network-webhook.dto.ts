import { IsString, IsOptional, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class Person {
  @IsString()
  email_address: string;

  @IsOptional()
  @IsString()
  given_name?: string;

  @IsOptional()
  @IsString()
  family_name?: string;

  @IsOptional()
  @IsString()
  status?: string;
}

class Event {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  start_date: string;

  @IsString()
  @IsOptional()
  end_date?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  identifiers: string; // uuid
}

export class ActionNetworkWebhookDto {
  @IsString()
  action: string; // 'person.signup', 'event.created', etc.

  @IsObject()
  @ValidateNested()
  @Type(() => Person)
  person?: Person;

  @IsObject()
  @ValidateNested()
  @Type(() => Event)
  event?: Event;
}
