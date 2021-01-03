import { ScheduledHandler } from 'aws-lambda';
import 'source-map-support/register';
import * as ccxt from 'ccxt';
import { Line } from './src/nortify/line';

const API_KEY = 'Input your API key';
const API_SECRET = 'Input your API secret';
const LINE_TOKEN = 'Input your line token';
const JPY_SIZE = 2740;

export const buyBitCoin: ScheduledHandler = async () => {
  const bitbank = new ccxt.bitbank({
    apiKey: API_KEY,
    secret: API_SECRET,
  });
  const orderbook: ccxt.OrderBook = await bitbank.fetchOrderBook('BTC/JPY');
  const lastAsk: number = orderbook.asks[0][0];
  const btcSize = Math.ceil((JPY_SIZE / lastAsk) * 10000) / 10000; //* 多めに買いたいので切り上げ
  const order: ccxt.Order = await bitbank.createMarketOrder(
    'BTC/JPY',
    'buy',
    btcSize,
    1
  );
  await new Promise((resolve) => setTimeout(resolve, 1000)); // order後すぐだと最新の取引が反映されていないので1秒待つことにした
  const sinceTimestamp = Date.now() - 86400000; //* とりあえず1日前からの取引履歴を取得
  const trades: ccxt.Trade[] = await bitbank.fetchMyTrades(
    'BTC/JPY',
    sinceTimestamp,
    1000
  );
  const tradesOfOrderId = trades.filter((trade) => {
    return trade.order === order.id;
  });
  const buyResult = { cost: 0, amount: 0, fee: 0 };
  tradesOfOrderId.forEach((trade) => {
    buyResult.cost += trade.cost;
    buyResult.amount += trade.amount;
    buyResult.fee += Number(trade.info['fee_amount_quote']);
  });

  console.log(
    `[orderId: ${order.id}] ${buyResult.amount} BTC was bought for about ${buyResult.cost} yen. Trading fee was ${buyResult.fee}`
  );

  const line = new Line(LINE_TOKEN);
  const message = `
bitbankでBTCを購入しました！

【注文ID】
    ${order.id}
【BTC枚数】
    ${buyResult.amount}
【使った日本円】
    ${buyResult.cost} 円
【手数料】
    ${buyResult.fee} 円`;

  line.notify(message);
};
