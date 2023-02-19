import express, { Request, Response, NextFunction } from 'express';
import moment from 'moment';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { VerifyOtpRegInputs } from '../../dto/auth';
import { PendingUser, CopyTrader, Trader } from '../../models';
import { GenerateSignature } from '../../utility';
import { AccountType } from '../../utility/acctType';

export const VerifyOtpReg = async (req: Request, res: Response, next: NextFunction) => {
  const otpRegInput = plainToInstance(VerifyOtpRegInputs, req.body);
  const inputErrors = await validate(otpRegInput, {
    validationError: { target: true },
  });

  if (inputErrors.length > 0) {
    return res.status(400).json(inputErrors[0].constraints);
  } else {
    const { phone, otp } = otpRegInput;

    try {
      const existingPendingUser = await PendingUser.findOne({ phone: phone });
      const copyTrader = await CopyTrader.findOne({ phone: phone });
      const trader = await Trader.findOne({ phone: phone });

      if (existingPendingUser !== null) {
        if (existingPendingUser.otp === otp && moment(existingPendingUser.otp_expiry) > moment()) {
          // const signature = await GenerateSignature({
          //   _id: existingUser._id,
          //   email: existingUser.email,
          //   activated: existingUser.activated,
          // });

          return res.status(200).json({
            message: 'success',
            phone: existingPendingUser.phone,
            // data: {
            //   token: signature,
            //   activated: existingUser.activated,
            //   email: existingUser.email,
            // },
            status: 1,
          });
        } else {
          return res.status(401).json({ message: 'invalid or otp expired', status: 0 });
        }
      } else {
        if (copyTrader !== null) {
          if (copyTrader.otp === otp && moment(copyTrader.otp_expiry) > moment()) {
            const signature = await GenerateSignature({
              _id: copyTrader._id,
              email: copyTrader.email,
              account_type: AccountType.CopyTrader,
            });

            return res.status(200).json({
              message: 'success',
              token: signature,
              status: 1,
            });
          } else {
            return res.status(401).json({ message: 'invalid or otp expired', status: 0 });
          }
        } else if (trader !== null) {
          if (trader.otp === otp && moment(trader.otp_expiry) > moment()) {
            const signature = await GenerateSignature({
              _id: trader._id,
              email: trader.email,
              account_type: AccountType.Trader,
            });

            return res.status(200).json({
              message: 'success',
              token: signature,
              status: 1,
            });
          } else {
            return res.status(401).json({ message: 'invalid or otp expired', status: 0 });
          }
        }
      }
    } catch (error) {
      return res.status(501).json({ message: 'Server Error ' + JSON.stringify(error), status: 0 });
    }
  }
};
