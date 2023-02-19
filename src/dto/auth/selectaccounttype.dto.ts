import { IsEmail, IsNotEmpty, Length, IsPhoneNumber, IsNumber, Max, Min } from 'class-validator';

export class SelectAccountTypeInputs {
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @IsNotEmpty()
  @IsNumber()
  @Max(2)
  @Min(1)
  account_type: number;
}
