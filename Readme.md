About

概要


nhouseは、別荘をオンラインで販売するだけでなく、

購入したオーナーがアプリで自宅（別荘）とホテルを自由に使い分ける事ができる住宅のDX,さらにシェアしたホテル側でのDXなど、

我々のライフスタイルを一貫してデジタル化するビジネスモデルを展開していきます。



【コンセプト】

別荘ビジネスの改革

ーテクノロジーで宿泊価値を変えるー

別荘の所有権を小口に分けてそれをECとNFTを活用して販売・管理する。

そして、土地・建物の価値を最大化出来るテーマを抽出し、デザインする。

知られていなかった価値の創造・発信することにより、周辺地域の活性化も実施。＝目的：土地の価値の最大化

旅の目的地に「別荘」及び「エリア」や「移動手段」が加わることで誰も体験したことのない「面での満足度向上」を果たし、

テクノロジーと共に旅行ビジネスの根幹を改革する。



【実現したい世界】

そこの土地の「価値」を最大化する。

そこの土地にしかない価値（エッセンス）を見抜き最高の形で人々に表現をして感動を与える。

世界各国にあるその土地ならではの体験をスマホ１つであなたのものへ。



【ロードマップ】

・別荘に宿泊することの出来る予約サイトとしての確立

・別荘を購入することの出来るシステムの確立

・サイトコントローラー開発

・チェックインシステム開発


【テックスタック】

・Astar Network

・NEXTJS

・Chakra UI

・Microsoft Azure

・NodeJS

・Typescript

・Hardhat

・Vercel AI

・Vercel

【アーキテクチャ】

![‎n'house アーキテクチャ phase2 ‎001](https://github.com/n-house/n-house-mock-ai-crypto-hack/assets/28668647/bbe30b6a-0306-4f17-aaf1-6247e8952852)


【起動手順】

・各ディレクトリ内で　`npm i` *ai-chatbotのみ `pnpm i`

・各ディレクトリ内でenv.exampleをもとに環境変数を設定 *apiのみ local.settings.json

・nhouse-mockディレクトリ内で `npm run dev`

・ルートディレクトリで `npm run start-swa`

【コントラクトデプロイ手順】

・nhouse-contractディレクトリ内で `npm i --legacy-peer-deps`

・次のコマンドでデプロイする。また、ログにコントラクトアドレスが表示されます。`npx hardhat run --network astar scripts/deploy.js` *NhouseNFTの場合

・コピーしたコントラクトアドレスを`scripts/mint-nft.js`にセットし、`npx hardhat run --network astar scripts/mint-nft.js`でNFTをミントすることができる。


【コントラクト情報など】

・NhouseNFT: 0xBE0505c227A3f786319f820510F9C09BB79EAb74

https://blockscout.com/astar/address/0xBE0505c227A3f786319f820510F9C09BB79EAb74

・N on the beach: 0x5B0CFea8D2b67ECb8320D3FED6DAB87D63b174C5

https://blockscout.com/astar/address/0x5B0CFea8D2b67ECb8320D3FED6DAB87D63b174C5
