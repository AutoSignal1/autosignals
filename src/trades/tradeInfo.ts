import ccxt from 'ccxt';

export class MyTradesClass {
  private client: ccxt.binance;

  constructor(apiKey: string, secret: string) {
    this.client = new ccxt.binance({
      enableRateLimit: true,
      apiKey,
      secret,
    });
  }

  public async loadMarkets() {
    try {
      return (await this.client.loadMarkets())['BNB/USDT'];
    } catch (error) {
      throw error;
    }
  }
  public async getBalance() {
    try {
      return await this.client.fetchFreeBalance();
    } catch (error) {
      throw error;
    }
  }
  public async fetchMyTrades(symbol: any, since: any, limit: any) {
    try {
      return await this.client.fetchMyTrades(symbol, since, limit);
    } catch (error) {
      throw error;
    }
  }

  public async fetchOrderBook(symbol: string) {
    try {
      return await this.client.fetchOrderBook(symbol);
    } catch (error) {
      throw error;
    }
  }
  public async fetchTicker(symbol: string) {
    try {
      return await this.client.fetchTicker(symbol);
    } catch (error) {
      throw error;
    }
  }

  public async fetchMyOrders(symbol: any, since: any, limit: any) {
    try {
      return await this.client.fetchOrders(symbol, since, limit);
    } catch (error) {
      throw error;
    }
  }
}
