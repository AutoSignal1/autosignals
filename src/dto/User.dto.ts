import { AccountType } from './../utility/acctType';
import { IsEmail, IsNotEmpty, Length, IsPhoneNumber, IsNumber } from 'class-validator';

export interface SignaturePayload {
  _id: string;
  email: string;
  account_type: AccountType;
}
