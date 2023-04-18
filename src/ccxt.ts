import ccxt from 'ccxt';

const dd = ccxt.binance;

const newBinance = new dd({
  apiKey: 'Xwe7yEXftsyWt1y5Zkz09upS4Ht3DS4ewmXy3Mr0g8JQ2WdOpnvYr0mHKdasabkz',
  secret: '9uBDFhv315kuJngAbLInH9wa3Dnn4fVfmpCggwOBvD9Hb66D5di84SrmS0nqpZ2c',
  enableRateLimit: true,
});

async function somefunc() {
  await newBinance.loadMarkets();

  console.log(
    await newBinance.fetchBalance({
      currency: 'btc',
    }),
  );
}
somefunc();
