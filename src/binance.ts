import Binance, { OrderType } from 'binance-api-node';
import moment from 'moment';
// const client = Binance({
//   apiKey: 'kqKOm9UvIHtqdYCw2vEMlLukvNE0AQkWdNgF2dFFdEJ0Fr80RVFALvi2A6AwarFc',
//   apiSecret: 'kRv1kc6uGroWRho3boFLxdDboMQoeUZaTA07yHybY5xriNKmguzczmrYQq7tC5zt',
// });
const client = Binance({
  apiKey: 'Xwe7yEXftsyWt1y5Zkz09upS4Ht3DS4ewmXy3Mr0g8JQ2WdOpnvYr0mHKdasabkz',
  apiSecret: '9uBDFhv315kuJngAbLInH9wa3Dnn4fVfmpCggwOBvD9Hb66D5di84SrmS0nqpZ2c',
});

const dd = async () => {
  try {
    const pp = await client.prices({ symbol: 'BNBUSDT' });

    console.log(
      // await client.orderOco({
      //   symbol: 'XLMETH',
      //   side: 'SELL',
      //   quantity: '001',
      //   price: '0.0002',
      //   stopPrice: '0.0001',
      //   stopLimitPrice: '0.0001',
      // }),

      // await client.tradesHistory({ symbol: 'ETHBTC', limit: 10 }),
      // await client.exchangeInfo(),
      //await client.accountInfo(),
      await client.orderTest({
        symbol: 'BNBUSDT',
        side: 'SELL',
        quantity: '0.000001',
        // price: pp['BNBUSDT'].toString(),
        // stopPrice: '309.01',

        type: OrderType.MARKET,
      }),

      // free: '0.00000735',
      // await client.allOrdersOCO({ timestamp: moment().unix(), recvWindow: 5000 }),
    );
  } catch (error) {
    console.log(error);
  }
  // const clean = client.ws.depth('ETHBTC', depth => {
  //   console.log(depth);
  // });
};

dd();
