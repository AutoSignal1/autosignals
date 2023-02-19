import express, { Request, Response, NextFunction } from 'express';
import moment from 'moment';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { RegisterTraderInputs } from '../../dto/auth';
import { CopyTrader, Trader, PendingUser } from '../../models';
import {
  GenerateOtp,
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  ValidatePassword,
} from '../../utility';

export const RegisterUser = async (req: Request, res: Response, next: NextFunction) => {
  const customerInputs = plainToInstance(RegisterTraderInputs, req.body);
  const inputErrors = await validate(customerInputs, {
    validationError: { target: true },
  });
  const date = new Date();
  if (inputErrors.length > 0) {
    return res.status(400).json(inputErrors[0].constraints);
  } else {
    const { email, password, phone } = customerInputs;
    const salt = await GenerateSalt();
    const hashedpassword = await GeneratePassword(password, salt);
    const existingPendingUser = await PendingUser.findOne({
      $or: [{ email: email }, { phone: phone }],
    });
    const existingCopyTrader = await CopyTrader.findOne({
      $or: [{ email: email }, { phone: phone }],
    });
    const existingTrader = await Trader.findOne({
      $or: [{ email: email }, { phone: phone }],
    });
    const { expiry, otp } = GenerateOtp();

    if (existingPendingUser !== null || existingTrader !== null || existingCopyTrader !== null) {
      res.status(400).json({ message: 'An existing user with provided data', status: 0 });
    } else {
      try {
        const result = await PendingUser.create({
          email: email,
          password: hashedpassword,
          salt: salt,
          phone: phone,
          otp: '1234',
          otp_expiry: expiry,
        });

        if (result) {
          // const response = await onRequestOTP(otp, phone);
          // const signature = await GenerateSignature({
          //   _id: result._id,
          //   email: result.email,
          //   activated: result.activated,
          // });

          return res.status(201).json({
            phone: result.phone,
            status: 1,
            message: 'Otp Sent to Phone Number ' + result.phone,
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
