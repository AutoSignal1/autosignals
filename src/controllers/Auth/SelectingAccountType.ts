import { SelectAccountTypeInputs } from './../../dto/auth';
import express, { Request, Response, NextFunction } from 'express';
import moment from 'moment';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CopyTrader, PendingUser, Trader } from '../../models';
import { GenerateSignature } from '../../utility';
import { AccountType } from '../../utility/acctType';

export const SelectAccountDetails = async (req: Request, res: Response, next: NextFunction) => {
  // const user = req.user;

  const reqInputs = plainToInstance(SelectAccountTypeInputs, req.body);
  const inputErrors = await validate(reqInputs, {
    validationError: { target: true },
  });
  if (inputErrors.length > 0) {
    return res.status(400).json(inputErrors[0].constraints);
  } else {
    try {
      const { account_type, phone } = reqInputs;
      const existingPendingUser = await PendingUser.findOne({ phone: phone });
      console.log(existingPendingUser, '---existingPendingUser ---');

      if (existingPendingUser !== null) {
        if (account_type === AccountType.Trader) {
          const result = await Trader.create({
            full_name: existingPendingUser.full_name,
            email: existingPendingUser.email,
            password: existingPendingUser.password,
            phone: existingPendingUser.phone,
            salt: existingPendingUser.salt,
            otp: existingPendingUser.otp,
            otp_expiry: existingPendingUser.otp_expiry,
          });

          if (result) {
            await PendingUser.deleteOne({ phone });
            const signature = await GenerateSignature({
              _id: result._id,
              email: result.phone,
              account_type: account_type,
            });

            return res.status(200).json({
              message: 'Account Selected',
              token: signature,
              status: 1,
            });
          } else {
            return res.status(503).json({
              message: 'Server Error',
              status: 0,
            });
          }
        } else if (account_type === AccountType.CopyTrader) {
          const result = await CopyTrader.create({
            full_name: existingPendingUser.full_name,
            email: existingPendingUser.email,
            password: existingPendingUser.password,
            phone: existingPendingUser.phone,
            salt: existingPendingUser.salt,
            otp: existingPendingUser.otp,
            otp_expiry: existingPendingUser.otp_expiry,
          });

          console.log(result, '-------  copy trdaer----');

          if (result) {
            await PendingUser.deleteOne({ phone });
            const signature = await GenerateSignature({
              _id: result._id,
              email: result.email,
              account_type: account_type,
            });

            return res.status(200).json({
              message: 'Account Selected',
              token: signature,
              status: 1,
            });
          }
        }
      } else {
        return res.status(400).json({
          message: 'Unknown User',
          status: 0,
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: 'Server Error',
        status: 0,
      });
    }
  }
};
