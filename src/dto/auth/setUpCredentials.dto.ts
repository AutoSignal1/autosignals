import { IsEmail, IsNotEmpty, Length, IsPhoneNumber, IsNumber, Max, Min } from 'class-validator';

export class SetUpCredentialsInputs {
  @IsNotEmpty()
  api_key?: string;

  @IsNotEmpty()
  secret?: string;

  @IsNotEmpty()
  platform: string;

  @IsNotEmpty()
  trade_type: string;
}
