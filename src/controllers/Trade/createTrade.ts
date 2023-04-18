import { CreateTradesClass } from './../../trades/createTrade';
import express, { Request, Response, NextFunction } from 'express';
import moment from 'moment';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { LoginTraderInputs } from '../../dto/auth';
import { AccountType } from '../../utility/acctType';
import { CopyTrader, Credential } from '../../models';
import { CreateTradeInputs } from '../../dto/trade/createtrade.dto';

export const CreateTrade = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  const reqInputs = plainToInstance(CreateTradeInputs, req.body);
  const inputErrors = await validate(reqInputs, {
    validationError: { target: true },
  });
  if (inputErrors.length > 0) {
    return res.status(400).json(inputErrors[0].constraints);
  } else {
    try {
      const {
        amount,
        price,
        type,
        side,
        symbol,
        params: { stopLoss, takeProfit },
      } = reqInputs;

      if (user.account_type === AccountType.CopyTrader) {
        const existingCopyTrader = await CopyTrader.findById(user._id);
        if (existingCopyTrader !== null) {
          const theMappedCred = existingCopyTrader.credentials.map(async item => {
            const dcred = await Credential.findById(item);
            if (dcred.platform === 'binance') {
              return dcred;
            }
          });
          const myTradeAcct = new CreateTradesClass(
            (await theMappedCred[0]).api_key,
            (await theMappedCred[0]).secret,
          );
          const result = await myTradeAcct.createOrder(symbol, type, side, amount, price, {
            stopLossPrice: stopLoss,
            takeProfitPrice: takeProfit,
          });
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
        message: error?.message,
        status: 0,
      });
    }
  }
};
