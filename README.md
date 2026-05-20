# スロエナDB

スマスロ ハイエナ稼働支援Webアプリ

## 機能
- 機種別期待値計算機
- AT間・CZ間 合算ロジック
- スルー回数/CZ間ハマり/駆け抜け/喰ポイント 補正自動化
- モード/招待状/終了画面/前兆/やめ時データベース
- お気に入り(LocalStorage)・機種検索
- PWA対応(ホーム画面に追加可能)

## 対応機種(15機種予定)
- スマスロ東京喰種
- スマスロ北斗の拳 転生の章2
- スマスロミリオンゴッド-神々の軌跡-
- スマスロ甲鉄城のカバネリ 海門決戦
- スマスロビッグドリーム
- スマスロモンキーターンV
- 他9機種(順次追加)

現状データ整備済みは「東京喰種」のみ。その他は「準備中」表示。

## 開発
```
npm install
npm run dev
```

http://localhost:5173 を開く。

## ビルド
```
npm run build
```
`prebuild` で `scripts/generate-icons.js` が走りアイコンを生成する。
`FullSizeRender.jpeg` をリポジトリ直下に置くとそれを素材に使用、無ければ
テーマカラーのプレースホルダを生成する。

## デプロイ
mainブランチへのpushで GitHub Actions により GitHub Pages へ自動デプロイ。
公開URL: https://sloena.gal-fella.com (独自ドメイン)

## データ追加フロー
1. `src/data/<id>.json` に完全データを作成/上書き
2. `status` を `"preparing"` → `"ready"` に変更
3. `src/data/index.ts` の `machineModules` に動的importを追加(未登録の場合)
4. commit & push で自動デプロイ

## データソース
altema, なな徹, のりへい, スロパチクエスト, ちょんぼりすた
