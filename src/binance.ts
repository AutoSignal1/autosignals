import Binance, { OrderType } from 'binance-api-node';

const client = Binance({
  apiKey: 'flnJNh564hH7Yftwxmwq7ZlB0t7R0sXi68jGnz92MABFVEtfVNa0Oxl5WXhHqRju',
});

const dd = async () => {
  console.log(
    await client.orderOco({
      symbol: 'XLMETH',
      side: 'BUY',
      quantity: '100',
      price: '0.0002',
      useServerTime: true,
      stopPrice: '0.0003  ',
    }),
  );
};

dd();
