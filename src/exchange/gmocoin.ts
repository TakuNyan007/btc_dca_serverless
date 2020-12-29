import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import * as crypto from 'crypto';
import {
  HttpMethod,
  MarketOrderParams,
  OrderParams,
  PrivateRequestHeader,
} from '../@types/gmocoin';

const PRIVATE_BASE_URL = 'https://api.coin.z.com/private';
const PATH_ASSETS = '/v1/account/assets';
const PATH_ORDER = '/v1/order';

export class GmoCoin {
  constructor(readonly apiKey: string, readonly apiSecret: string) {}

  async marketOrder(params: MarketOrderParams) {
    const orderParams: OrderParams = { ...params, executionType: 'MARKET' };
    const axiosConfig: AxiosRequestConfig = {
      headers: this.createHeader('POST', PATH_ORDER, orderParams),
    };
    const res: AxiosResponse = await axios.post(
      PRIVATE_BASE_URL + PATH_ORDER,
      orderParams,
      axiosConfig
    );
    return res.data;
  }

  private createHeader(
    method: HttpMethod,
    path: string,
    reqBody?: object
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
