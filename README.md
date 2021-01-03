# AWS Lambda×TypeScript の BTC ドルコスト平均法積み立て BOT

※README.md は現在編集中です。  

## 本プロジェクトの目的
BTCをドルコスト平均法で毎日買うBOTをAWS Lambdaで動かすという題材で
 - TypeScript
 - AWS Lambda
 - serverless frameworkの使い方

をキャッチアップしていきます。  
(作成の過程を記事にまとめたいのですが、現在編集中です)

## 完成したもの
 - AWS Lambdaを定期実行し、毎日1回Lambdaの環境変数で指定した日本円分のBTCを買うBOT（※利用取引所：bitbank）
 - 毎日の取引後、LINE通知してくれる

## 環境構築～実装開始までの流れ
Qiita記事に移管しました。  
[VSCodeでServerless Framework(AWS×TypeScript)をデバッグするまでの手順](https://qiita.com/oretakuan/items/c792f40f83fe74d73786)

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
