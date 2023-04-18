import bcrypt from 'bcrypt';
import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { SignaturePayload } from '../dto';

const APP_SECRET = process.env.APP_SECRET;
export const GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

export const GeneratePassword = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};

export const ValidatePassword = async (
  enteredPassword: string,
  savedpassword: string,
  salt: string,
) => {
  return (await GeneratePassword(enteredPassword, salt)) === savedpassword;
};

export const GenerateSignature = async (payload: SignaturePayload) => {
  const signature = jwt.sign(payload, APP_SECRET, { expiresIn: '1d' });

  return signature;
};

export const ValidateSignature = async (req: Request) => {
  const signature = req.get('Authorization');

  try {
    if (signature) {
      const payload = (await jwt.verify(signature.split(' ')[1], APP_SECRET)) as SignaturePayload;

      req.user = payload;

      // return true;
      return {
        status: true,
      };
    }
  } catch (error) {
    return {
      status: false,
      error: error,
    };
  }
  // return false;
};
