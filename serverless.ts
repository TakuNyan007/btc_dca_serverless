import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'btc-dca-serverless',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  // Add the serverless-webpack plugin
  plugins: ['serverless-webpack', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    region: 'ap-northeast-1',
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      BITBANK_API_KEY: 'Please input yours',
      BITBANK_API_SECRET: 'Please input yours',
      LINE_TOKEN: 'Please input yours',
      JPY_PER_DAY: '3000', //毎日, JPY_PER_DAY円でBTC購入する（最小単位の関係で10%ほど多く購入される場合あり）
    },
  },
  functions: {
    buyBitCoin: {
      handler: 'handler.buyBitCoin',
      events: [
        {
          schedule: {
            name: 'BuyBitCoinScheduledEvent',
            rate: 'cron(0 4 * * ? *)',
          },
        },
      ],
    },
  },
};

module.exports = serverlessConfiguration;
