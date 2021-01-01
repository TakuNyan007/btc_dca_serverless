import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import * as crypto from 'crypto';
import {
  GmoCoinApiResponse,
  GmoCoinSymbol,
  HttpMethod,
  MarketOrderParams,
  OrderBooksResponse,
  OrderParams,
  PrivateRequestHeader,
} from '../@types/gmocoin';

const BASE_URL = 'https://api.coin.z.com';
const PRIVATE_BASE_URL = 'https://api.coin.z.com/private';
const PATH_ORDER = '/v1/order';
const PATH_ORDERBOOKS = '/public/v1/orderbooks';

export class GmoCoin {
  constructor(readonly apiKey: string, readonly apiSecret: string) {}

  async fetchOrderBook(symbol: GmoCoinSymbol): Promise<OrderBooksResponse> {
    const axiosConfig: AxiosRequestConfig = {
      params: { symbol: symbol },
    };
    const res: AxiosResponse = await axios.get(
      BASE_URL + PATH_ORDERBOOKS,
      axiosConfig
    );
    const orderbooks: GmoCoinApiResponse = res.data;
    return orderbooks.data as OrderBooksResponse;
  }

  async marketOrder(params: MarketOrderParams): Promise<string> {
    const orderParams: OrderParams = { ...params, executionType: 'MARKET' };
    const axiosConfig: AxiosRequestConfig = {
      headers: this.createHeader('POST', PATH_ORDER, orderParams),
    };
    const res: AxiosResponse = await axios.post(
      PRIVATE_BASE_URL + PATH_ORDER,
      orderParams,
      axiosConfig
    );
    const result: GmoCoinApiResponse = res.data;
    return result.data as string;
  }

  private createHeader(
    method: HttpMethod,
    path: string,
    reqBody?: { [key: string]: unknown }
  ): PrivateRequestHeader {
    const timestamp = Date.now().toString();
    const text = timestamp + method + path + JSON.stringify(reqBody);
    const sign = crypto
      .createHmac('sha256', this.apiSecret)
      .update(text)
      .digest('hex');
    return {
      'API-KEY': this.apiKey,
      'API-TIMESTAMP': timestamp,
      'API-SIGN': sign,
    };
  }
}
