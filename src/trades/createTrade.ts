import { fetchMyOrders } from './../controllers/Trade/fetchOrders';
import ccxt from 'ccxt';

export class CreateTradesClass {
  private client: ccxt.binance;

  constructor(apiKey: string, secret: string) {
    this.client = new ccxt.binance({
      enableRateLimit: true,
      apiKey,
      secret,
    });
  }

  public async createOrder(
    symbol: string,
    type: 'limit' | 'market',
    side: 'buy' | 'sell',
    amount: number,
    price: number,
    params,
  ) {
    let splitSymbol = symbol.split('/');
    const baseAsset = splitSymbol[0];
    const quoteAsset = splitSymbol[1];
    try {
      const balance = await this.client.fetchFreeBalance();
      const baseBalance = balance[baseAsset];
      const quoteBalance = balance[quoteAsset];

      if (baseBalance > amount) {
        return await this.client.createOrder(symbol, type, side, amount, price, params);
      } else {
        throw { message: 'Balance not Enough' };
      }
    } catch (error) {
      throw error;
    }
  }
  private async fetchOrderBook(symbol: string) {
    try {
      return await this.client.fetchOrderBook(symbol);
    } catch (error) {
      throw error;
    }
  }

  // public async getBalance() {
  //   try {
  //     return await this.client.fetchBalance();
  //   } catch (error) {
  //     throw error;
  //   }
  // }
  // public async fetchOrders() {
  //   try {
  //     return await this.client.fetchOrders();
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}
