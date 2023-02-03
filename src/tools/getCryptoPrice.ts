import axios from 'axios';
import cc from 'currency-converter-lt';

const CoinGeckoURL = process.env.COINGECKO_BASEURL;

//CONVERT TOKEN VALUE TO USD
const getCryptoPriceUSD = async (tokenSymbol, amount) => {
  try {
    const response = await axios.get(
      `${CoinGeckoURL}/simple/price?ids=bitcoin%2Cethereum%2Cbinancecoin&vs_currencies=usd`,
    );
    console.log(response.data);

    if (tokenSymbol == 'BTC') {
      return response.data.bitcoin.usd * amount;
    } else if (tokenSymbol == 'ETH') {
      return response.data.ethereum.usd * amount;
    } else if (tokenSymbol == 'BNB') {
      return response.data.binancecoin.usd * amount;
    } else if (tokenSymbol == 'USDT') {
      return amount;
    }
  } catch (error) {
    console.log(error);
  }
};

//CONVERT TOKEN VALUE TO OTHER CURRENCIES
const getCryptoPriceOtherCURRENCY = async (tokenSymbol, amount, currency) => {
  try {
    const amountInUSD = await getCryptoPriceUSD(tokenSymbol, amount);
    let currencyConverter = new cc({ from: 'USD', to: currency, amount: amountInUSD });
    //  console.log("currecy convert", amountInUSD)
    const result = await currencyConverter.convert();
    return result;
  } catch (error) {
    console.log(error);
  }
};
