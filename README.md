# AWS Lambda×TypeScriptのBTCドルコスト平均法積み立てBOT


## 環境構築の流れ
### Hello Serverless!手順

1. serverlessのインストール
```
npm i -g serverless
```

2. serverless templateの作成
```
sls create -t aws-nodejs-typescript -p btc_dca_serverless
```

3. パッケージをインストール
```
npm i
```

4. serverlessの型定義ファイルをインストール
```
npm i -D @types/node @types/serverless
```

5. 試しにデプロイ
```
sls deploy
```

6. ログに表示されたendpointsにアクセスして動作確認

7. デプロイした奴を削除
```
sls remove
```

8. 実装開始！

### 混乱したこと
serverless.ymlが生成されると思ったらserverless.tsでびっくり  
でも、ymlよりこっちの方がわかりやすいかも？