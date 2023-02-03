import { IsEmail, IsNotEmpty, Length, IsPhoneNumber, IsNumber } from 'class-validator';

export class CreateUserInputs {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsNumber()
  user_type: number;

  @IsNotEmpty()
  @Length(6, 12)
  password: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;
}
export class VerifyEmailInputs {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
export class VerifyOtpRegInputs {
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @IsNotEmpty()
  @Length(4)
  otp: string;
}
export class LoginInputs {
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @IsNotEmpty()
  @Length(6, 12)
  password: string;
}

export interface UserPayload {
  _id: string;
  email: string;
  activated: boolean;
}

export class UserLoginInput {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(6, 12)
  password: string;
}
