import { ScheduledHandler } from 'aws-lambda';
import 'source-map-support/register';
import { OrderBooksResponse } from './src/@types/gmocoin';
import { GmoCoin } from './src/exchange/gmocoin';

const apiKey = 'InputYourApiKey';
const apiSecret = 'InputYourApiSecret';

export const buyBitCoin: ScheduledHandler = async () => {
  const jpySize = 2740;
  const gmoCoin = new GmoCoin(apiKey, apiSecret);
  const orderbooks: OrderBooksResponse = await gmoCoin.fetchOrderBook('BTC');
  const lastAsk = Number(orderbooks.asks[0].price);
  const btcSize = Math.ceil((jpySize / lastAsk) * 10000) / 10000; //* 多めに買いたいので切り上げ
  const orderId: string = await gmoCoin.marketOrder({
    symbol: 'BTC',
    side: 'BUY',
    size: btcSize,
  });
  console.log(
    `[orderId: ${orderId}] ${btcSize} BTC was bought at ${lastAsk} yen (About ${
      lastAsk * btcSize
    } yen)`
  );
};
