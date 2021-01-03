# AWS Lambda×TypeScript の BTC ドルコスト平均法積み立て BOT

※README.md は現在編集中です。

## 環境構築の流れ

### Hello Serverless!手順

1. serverless のインストール

```
npm i -g serverless
```

2. serverless template の作成

```
sls create -t aws-nodejs-typescript -p btc_dca_serverless
```

3. パッケージをインストール

```
npm i
```

4. serverless の型定義ファイルをインストール

```
npm i -D @types/node @types/serverless
```

5. 試しにデプロイ

```
sls deploy
```

6. ログに表示された endpoints にアクセスして動作確認

7. デプロイした奴を削除

```
sls remove
```

8. 実装開始！

### 混乱したこと

serverless.yml が生成されると思ったら serverless.ts でびっくり  
でも、yml よりこっちの方がわかりやすいかも？

## 取引所の選定

BTC 積み立てを行う取引所を選びます。候補は僕が登録済み、かつ、API を提供しているこの 4 つです。

- bitbank
- GMO コイン
- Liquid
- bitflyer

この 4 つを比較してみます。
|取引所|Taker 手数料|Maker 手数料|最小取引単位|出金手数料
|---|---|---|---|---|---|
|bitbank|0.12%|-0.02%|0.0001BTC|770 円
|GMO コイン|0.05%|-0.01%|0.0001BTC|無料
|Liquid|無料|無料|0.001BTC|510 円
|bitflyer|0.01~0.15%|0.01~0.15%|0.001BTC|440 円
|

Liquid, bitflyer は取引手数料が魅力的ですが、最小単位が 0.001BTC と大きいので  
この時点で候補から外れます。  
僕は 1 年間で合計 100 万円をドルコスト平均法で入れる予定なので 1 日 2740 円になります。  
最小単位が 0.001BTC だとちょっときついです。  
~~取引手数料が比較的低く、出金手数料が無料な GMO コインで BTC 積み立てを行うこととします。~~  
※手数料は高いですが、他取引所より BTC 価格が安くなりがちな傾向があったため、今回は bitbank を採用します。

### 指値 or 成行？

GMO コインだと指値注文だと 0.02%もらえるっぽいですね。  
100 万円だと年間 200 円もらえることになります。成行手数料は 0.05%なので年間 500 円支払うことになります。  
ロジック簡略化のため、かつ、そこまで高い手数料ではないので成行注文で積み立てを行うことにします。

## GMO コイン API ラッパーの作成（以下編集中）

GMO コインの API ドキュメントを参考に実装を行います。[GMO コイン API ドキュメント](https://api.coin.z.com/docs/?javascript#margin)  
まず、必要なライブラリをインストールします。  
<br/>
HTTP 通信用に axios とプライベート API の暗号化用に crypto ライブラリを入れます。

```
npm i axios
```

```
npm i crypto
```
