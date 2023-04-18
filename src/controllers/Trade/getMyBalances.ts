import { MyTradesClass } from '../../trades/tradeInfo';
import express, { Request, Response, NextFunction } from 'express';
import moment from 'moment';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { LoginTraderInputs } from '../../dto/auth';
import { AccountType } from '../../utility/acctType';
import { CopyTrader, Credential } from '../../models';

export const getMyBalances = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;

  try {
    if (user.account_type === AccountType.CopyTrader) {
      const existingCopyTrader = await CopyTrader.findById(user._id);
      if (existingCopyTrader !== null) {
        const theMappedCred = existingCopyTrader.credentials.map(async item => {
          const dcred = await Credential.findById(item);
          if (dcred.platform === 'binance') {
            return dcred;
          }
        });

        const myTradeAcct = new MyTradesClass(
          (await theMappedCred[0]).api_key,
          (await theMappedCred[0]).secret,
        );
        const result = await myTradeAcct.getBalance();
        return res.status(200).json({
          status: 1,
          data: result,
        });
      } else {
        return res.status(500).json({
          message: 'Something Went Wrong',
          status: 0,
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      message: 'Unable to get Balance ' + error?.message,
      status: 0,
    });
  }
};
