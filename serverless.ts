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
