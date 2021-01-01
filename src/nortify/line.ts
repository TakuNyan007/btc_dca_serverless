import axios, { AxiosRequestConfig } from 'axios';
import { LineNotifyParams } from '../@types/line';
import * as qs from 'querystring';

export class Line {
  private readonly BASE_URL = 'https://notify-api.line.me/api/notify';
  constructor(readonly token: string) {}

  async notify(message: string): Promise<void> {
    const params: LineNotifyParams = {
      message: message,
    };

    const headers: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    await axios.post(this.BASE_URL, qs.stringify(params), headers);
  }
}
