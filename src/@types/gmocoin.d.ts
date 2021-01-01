export type GmoCoinApiResponse = {
  status: Statuscode;
  data?: string | { [key: string]: unknown };
  messages: Array<{ message_code: string; message_string: string }>;
  responsetime: Date;
};

export interface Asset {
  amount: string;
  available: string;
  conversionRate: string;
  symbol: string;
}

export type OrderParams = {
  symbol: GmoCoinSymbol;
  side: Side;
  executionType: ExecutionType;
  timeInForce?: TimeInForce;
  price?: number;
  losscutPrice?: string;
  size: number;
  cancelBefore?: boolean;
};

export type MarketOrderParams = {
  symbol: GmoCoinSymbol;
  side: Side;
  size: number;
};

export type OrderResponse = string;

export type OrderBooksParams = {
  symbol: GmoCoinSymbol;
};

export type OrderBooksResponse = {
  asks: Array<OrderBook>;
  bids: Array<OrderBook>;
};

export type OrderBook = {
  price: number;
  size: number;
};

export interface PrivateRequestHeader {
  'API-KEY': string;
  'API-TIMESTAMP': string;
  'API-SIGN': string;
}

export type GmoCoinSymbol =
  | 'BTC'
  | 'ETH'
  | 'BCH'
  | 'LTC'
  | 'XRP'
  | 'BTC_JPY'
  | 'ETH_JPY'
  | 'BCH_JPY'
  | 'LTC_JPY'
  | 'XRP_JPY';

export type HttpMethod = 'GET' | 'POST';

export type Statuscode = 200 | 404 | 503;

export type Side = 'BUY' | 'SELL';

export type ExecutionType = 'MARKET' | 'LIMIT' | 'STOP';

export type TimeInForce = 'FAK' | 'FAS' | 'FOK' | 'SOK';
