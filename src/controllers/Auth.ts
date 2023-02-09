import { onRequestOTP } from '../utility/NotificationUtility';
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

export const RegisterUser = async (req: Request, res: Response, next: NextFunction) => {
  const customerInputs = plainToInstance(CreateUserInputs, req.body);
  const inputErrors = await validate(customerInputs, {
    validationError: { target: true },
  });
  const date = new Date();
  if (inputErrors.length > 0) {
    return res.status(400).json(inputErrors);
  } else {
    const { email, password, user_type, phone } = customerInputs;
    const salt = await GenerateSalt();
    const hashedpassword = await GeneratePassword(password, salt);
    const existingUser = await User.findOne({ $or: [{ email: email }, { phone: phone }] });
    const { expiry, otp } = GenerateOtp();

    if (existingUser !== null) {
      res.status(400).json({ message: 'An existing user with provided data', status: 0 });
    } else {
      try {
        const result = await User.create({
          email: email,
          password: hashedpassword,
          salt: salt,
          phone: phone,
          otp: '1234',
          otp_expiry: expiry,
          user_type,
          username: '',
          firstname: '',
          lastname: '',
          address: '',
          activated: false,
        });

        if (result) {
          // const response = await onRequestOTP(otp, phone);
          const signature = await GenerateSignature({
            _id: result._id,
            email: result.email,
            activated: result.activated,
          });

          return res.status(201).json({
            phone: result.phone,
            status: 1,
            message: 'Otp Sent to Phone Number',
          });
        }
      } catch (error) {
        return res.status(500).json({
          status: 0,
          message: 'Error ' + error,
        });
      }
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
    const { phone, otp } = otpRegInput;

    try {
      const existingUser = await User.findOne({ phone });

      if (existingUser !== null) {
        if (existingUser.otp === otp && moment(existingUser.otp_expiry) > moment()) {
          const signature = await GenerateSignature({
            _id: existingUser._id,
            email: existingUser.email,
            activated: existingUser.activated,
          });

          return res.status(200).json({
            message: 'success',
            data: {
              token: signature,
              activated: existingUser.activated,
              email: existingUser.email,
            },
            status: 1,
          });
        } else {
          return res.status(401).json({ message: 'invalid or otp expired', status: 0 });
        }
      }
    } catch (error) {
      return res.status(501).json({ message: 'Server Error ' + JSON.stringify(error), status: 0 });
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
    const { phone, password } = loginInput;
    const existingUser = await User.findOne({ phone: phone });
    const { expiry, otp } = GenerateOtp();

    if (existingUser !== null) {
      const valPassword = await ValidatePassword(
        password,
        existingUser.password,
        existingUser.salt,
      );

      if (valPassword) {
        // const response = await onRequestOTP(otp, phone);

        existingUser.otp = '1234';
        existingUser.otp_expiry = expiry;
        // const signature = await GenerateSignature({
        //   _id: existingUser._id,
        //   email: existingUser.email,
        //   activated: existingUser.activated,
        // });

        const result = await existingUser.save();
        if (result) {
          return res.status(201).json({
            phone: result.phone,
            status: 1,
            message: 'Otp Sent to Phone Number',
          });
        }
      } else {
        return res.status(401).json({
          message: 'invalid password',
          status: 0,
        });
      }
    } else {
      return res.status(401).json({
        message: 'invalid details',
        status: 0,
      });
    }
  }
};
