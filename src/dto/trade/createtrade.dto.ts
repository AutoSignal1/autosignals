import { IsEmail, IsNotEmpty, Length, IsPhoneNumber, IsNumber, IsEnum } from 'class-validator';

export class CreateTradeInputs {
  @IsNotEmpty()
  symbol: string;

  @IsNotEmpty()
  type: 'limit' | 'market';

  @IsNotEmpty()
  side: 'buy' | 'sell';

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  params: CreateTradeParams;
}

class CreateTradeParams {
  @IsNotEmpty()
  takeProfit: number;

  @IsNotEmpty()
  stopLoss: number;
}
