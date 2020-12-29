import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { GmoCoin } from './src/exchange/gmocoin';

export const hello: APIGatewayProxyHandler = async (event, _context) => {
  const gmocoin = new GmoCoin('Input your api key', 'Input your api secret');
  const res = await gmocoin.marketOrder({
    symbol: 'BTC',
    side: 'BUY',
    size: 0.0001,
  });

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message:
          'Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!',
        input: event,
      },
      null,
      2
    ),
  };
};
