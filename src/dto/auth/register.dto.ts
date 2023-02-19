import { IsEmail, IsNotEmpty, Length, IsPhoneNumber, IsNumber } from 'class-validator';

export class RegisterTraderInputs {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(6, 12)
  password: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;
}
