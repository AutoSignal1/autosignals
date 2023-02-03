import express, { Request, Response, NextFunction } from 'express';
import moment from 'moment';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateUserInputs, LoginInputs, VerifyOtpRegInputs } from '../dto';
import { User } from '../models';
import {
  GenerateOtp,
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  ValidatePassword,
} from '../utility';
import tokenData from '../tools/tokendata';

export const RegisterUser = async (req: Request, res: Response, next: NextFunction) => {
  const customerInputs = plainToInstance(CreateUserInputs, req.body);
  const inputErrors = await validate(customerInputs, {
    validationError: { target: true },
  });
  const date = new Date();
  if (inputErrors.length > 0) {
    return res.status(400).json(inputErrors);
  } else {
    const { email, password, username } = customerInputs;
    const salt = await GenerateSalt();
    const newpassword = await GeneratePassword(password, salt);
    const existingUser = await User.findOne({ email: email });

    if (existingUser !== null) {
    } else {
      return res.status(501).json({
        message: 'Server Error',
      });
    }
  }
};

// export const VerifyEmail = async (req: Request, res: Response, next: NextFunction) => {
//   const emialinput = plainToInstance(VerifyEmailInputs, req.body);
//   const inputErrors = await validate(emialinput, {
//     validationError: { target: true },
//   });

//   if (inputErrors.length > 0) {
//     return res.status(400).json(inputErrors);
//   } else {
//     const { email } = emialinput;
//     const existingEmail = await User.findOne({ email: email });

//     if (existingEmail === null) {
//       const { expiry, otp } = GenerateOtp();
//       let tempUser = await User.create({
//         email: email,
//         otp,
//         otp_expiry: expiry,
//       });

//       if (tempUser) {
//         EmailVerificationTemplate(email, otp);
//         return res.status(200).json({ message: 'success' });
//       }
//     } else {
//       return res.status(401).json({ message: 'user with email exist' });
//     }
//   }
// };
export const VerifyOtpReg = async (req: Request, res: Response, next: NextFunction) => {
  const otpRegInput = plainToInstance(VerifyOtpRegInputs, req.body);
  const inputErrors = await validate(otpRegInput, {
    validationError: { target: true },
  });

  if (inputErrors.length > 0) {
    return res.status(400).json(inputErrors);
  } else {
    const { email, otp } = otpRegInput;
    const existingEmail = await User.findOne({ email: email });

    if (existingEmail !== null) {
      if (existingEmail.otp === otp && moment(existingEmail.otp_expiry) > moment()) {
        return res.status(200).json({ message: 'success' });
      } else {
        return res.status(401).json({ message: 'invalid or otp expired' });
      }
    }
  }
};

export const LoginUser = async (req: Request, res: Response, next: NextFunction) => {
  const loginInput = plainToInstance(LoginInputs, req.body);
  const inputErrors = await validate(loginInput, {
    validationError: { target: true },
  });

  if (inputErrors.length > 0) {
    return res.status(400).json(inputErrors);
  } else {
    const { email, password } = loginInput;
    const existingEmail = await User.findOne({ email: email });

    if (existingEmail !== null) {
      const valPassword = await ValidatePassword(
        password,
        existingEmail.password,
        existingEmail.salt,
      );

      if (valPassword) {
        const signature = await GenerateSignature({
          _id: existingEmail._id,
          email: existingEmail.email,
          verified: existingEmail.verified,
        });

        return res.status(200).json({
          token: signature,
          email: existingEmail.email,
        });
      } else {
        return res.status(401).json({
          message: 'invalid password',
        });
      }
    } else {
      return res.status(401).json({
        message: 'invalid details',
      });
    }
  }
};
