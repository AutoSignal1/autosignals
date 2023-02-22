import express, { Request, Response, NextFunction } from 'express';
import moment from 'moment';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { LoginTraderInputs } from '../../dto/auth';
import { CopyTrader, PendingUser, Trader } from '../../models';
import { GenerateOtp, ValidatePassword } from '../../utility';

export const LoginUser = async (req: Request, res: Response, next: NextFunction) => {
  const loginInput = plainToInstance(LoginTraderInputs, req.body);
  const inputErrors = await validate(loginInput, {
    validationError: { target: true },
  });

  if (inputErrors.length > 0) {
    return res.status(400).json(inputErrors[0].constraints);
  } else {
    try {
      const { phone, password } = loginInput;
      const existingPendingUser = await PendingUser.findOne({ phone: phone });
      const existingTrader = await Trader.findOne({ phone: phone });
      const existingCopyTrader = await CopyTrader.findOne({ phone: phone });
      const { expiry, otp } = GenerateOtp();

      if (existingPendingUser !== null) {
        const valPassword = await ValidatePassword(
          password,
          existingPendingUser.password,
          existingPendingUser.salt,
        );

        if (valPassword) {
          // const response = await onRequestOTP(otp, phone);

          existingPendingUser.otp = '1234';
          existingPendingUser.otp_expiry = expiry;
          // const signature = await GenerateSignature({
          //   _id: existingPendingUser._id,
          //   email: existingPendingUser.email,
          //   activated: existingPendingUser.activated,
          // });

          const result = await existingPendingUser.save();
          if (result) {
            return res.status(201).json({
              phone: result.phone,
              status: 1,
              message: 'Otp Sent to Phone Number ' + result.phone,
            });
          }
        } else {
          return res.status(401).json({
            message: 'Invalid password',
            status: 0,
          });
        }
      } else {
        if (existingTrader !== null) {
          const valPassword = await ValidatePassword(
            password,
            existingTrader.password,
            existingTrader.salt,
          );

          if (valPassword) {
            // const response = await onRequestOTP(otp, phone);

            existingTrader.otp = '1234';
            existingTrader.otp_expiry = expiry;

            const result = await existingTrader.save();
            if (result) {
              return res.status(201).json({
                phone: result.phone,
                status: 1,
                message: 'Otp Sent to Phone Number ' + result.phone,
              });
            }
          } else {
            return res.status(401).json({
              message: 'Invalid password',
              status: 0,
            });
          }
        } else if (existingCopyTrader !== null) {
          const valPassword = await ValidatePassword(
            password,
            existingCopyTrader.password,
            existingCopyTrader.salt,
          );

          if (valPassword) {
            // const response = await onRequestOTP(otp, phone);

            existingCopyTrader.otp = '1234';
            existingCopyTrader.otp_expiry = expiry;

            const result = await existingCopyTrader.save();
            if (result) {
              return res.status(201).json({
                phone: result.phone,
                status: 1,
                message: 'Otp Sent to Phone Number ' + result.phone,
              });
            }
          } else {
            return res.status(401).json({
              message: 'Invalid password',
              status: 0,
            });
          }
        } else {
          return res.status(401).json({
            message: 'Invalid details',
            status: 0,
          });
        }
      }
    } catch (error) {
      return res.status(501).json({ message: 'Server Error ' + JSON.stringify(error), status: 0 });
    }
  }
};
