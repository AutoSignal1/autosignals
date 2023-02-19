import { IsEmail, IsNotEmpty, Length, IsPhoneNumber, IsNumber } from 'class-validator';

export class LoginTraderInputs {
  // @IsNotEmpty()
  // @IsEmail()
  // email: string;

  @IsNotEmpty()
  @Length(6, 12)
  password: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;
}
