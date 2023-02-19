import { IsEmail, IsNotEmpty, Length, IsPhoneNumber, IsNumber } from 'class-validator';

export class VerifyOtpRegInputs {
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @IsNotEmpty()
  @Length(4)
  otp: string;
}
