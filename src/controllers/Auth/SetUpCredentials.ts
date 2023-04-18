import express, { Request, Response, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CopyTrader, Credential, Trader } from '../../models';
import { AccountType } from '../../utility/acctType';
import { SetUpCredentialsInputs } from '../../dto/auth/setUpCredentials.dto';

export const SetUpCredentials = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;

  const reqInputs = plainToInstance(SetUpCredentialsInputs, req.body);
  const inputErrors = await validate(reqInputs, {
    validationError: { target: true },
  });
  const date = new Date();
  if (inputErrors.length > 0) {
    return res.status(400).json(inputErrors[0].constraints);
  } else {
    try {
      const { trade_type, api_key, platform, secret } = reqInputs;

      if (user.account_type === AccountType.CopyTrader) {
        const existingCopyTrader = await CopyTrader.findById(user._id);

        if (existingCopyTrader !== null) {
          const cred = await Credential.create({
            api_key: api_key,
            secret: secret,
            trade_type: trade_type,
            platform: platform,
          });

          if (cred) {
            existingCopyTrader.credentials.push(cred);
            const result = await existingCopyTrader.save();

            if (result) {
              return res.status(201).json({
                status: 1,
                message: 'credentials saved successfully',
              });
            }
          }
        } else {
          res.status(403).json({
            status: 0,
            message: 'Unable to Complete',
          });
        }
      } else if (user.account_type === AccountType.Trader) {
        const existingTrader = await Trader.findById(user._id);

        // if(existingTrader !== null){
        //   const cred = await Credential.create({
        //     api_key: api_key,
        //     secret,
        //     trade_type,
        //     platform,
        //   });

        //   if(cred){
        //     existingTrader.credentials.push(cred);

        //   }

        // }
      }
    } catch (error) {
      return res.status(500).json({
        message: 'Server Error ' + JSON.stringify(error),
        status: 0,
      });
    }
  }
};
