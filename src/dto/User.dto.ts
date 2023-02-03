import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class CreateUserInputs {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(6, 20)
  username: string;

  @IsNotEmpty()
  @Length(6, 12)
  password: string;
}
export class VerifyEmailInputs {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
export class VerifyOtpRegInputs {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(6)
  otp: string;
}
export class LoginInputs {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(6)
  password: string;
}

export interface UserPayload {
  _id: string;
  email: string;
  verified: boolean;
}

export class UserLoginInput {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(6, 12)
  password: string;
}
