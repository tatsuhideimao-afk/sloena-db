# スロエナDB 追加機種データ反映指示

## 概要
既存リポジトリ `tatsuhideimao-afk/sloena-db` に以下を追加・更新する:
- 沖ドキ!GOLD / 沖ドキ!BLACK の2機種を新規追加(machines-meta.jsonを17機種版に更新)
- ミリオンゴッド-神々の軌跡-(GOD) の完全データを実装(現在はスタブ)
- 沖ドキGOLD/BLACK の完全データを実装

## カレントディレクトリに配置済みファイル
- `machines-meta-v2.json` ← 17機種版メタデータ(`src/data/machines.json`を置き換え)
- `data-god-kamigami.json` ← GODの完全データ(`src/data/god-kamigami.json`を置き換え)
- `data-okidoki-gold.json` ← 沖ドキGOLD完全データ(新規追加)
- `data-okidoki-black.json` ← 沖ドキBLACK完全データ(新規追加)

## 作業手順

### Step 1: 既存ファイルの置き換え

1. `machines-meta-v2.json` を `src/data/machines.json` にコピー(上書き)
2. `data-god-kamigami.json` を `src/data/god-kamigami.json` にコピー(上書き)
3. `data-okidoki-gold.json` を `src/data/okidoki-gold.json` として新規配置
4. `data-okidoki-black.json` を `src/data/okidoki-black.json` として新規配置

### Step 2: データロード機構の更新

`src/data/index.ts` の `machineModules` オブジェクトに以下を追加:

```typescript
const machineModules: Record<string, () => Promise<{ default: Machine }>> = {
  'tokyo-ghoul': () => import('./tokyo-ghoul.json'),
  'hokuto-tensei2': () => import('./hokuto-tensei2.json'),
  'god-kamigami': () => import('./god-kamigami.json'),
  'kabaneri2': () => import('./kabaneri2.json'),
  'bigdream': () => import('./bigdream.json'),
  'monkey-v': () => import('./monkey-v.json'),
  // 以下を追加
  'okidoki-gold': () => import('./okidoki-gold.json'),
  'okidoki-black': () => import('./okidoki-black.json'),
};
```

### Step 3: 動作確認

`npm run dev` で開発サーバ起動して:
- ホーム画面で17機種表示(沖ドキ2機種が追加されている)
- 「沖ドキ」で検索すると2機種ヒット
- GOD / 沖ドキGOLD / 沖ドキBLACK の3機種が「準備中」バッジなし(status: "ready")
- 各機種の詳細画面で期待値計算機/モード/示唆/終了画面/前兆/やめ時タブが動作

### Step 4: commit & push

```bash
git add .
git commit -m "Add GOD/okidoki-gold/okidoki-black machine data, update to 17 machines"
git push origin main
```

(または PR経由でmainへマージ)

GitHub Actions が自動で再デプロイ → `https://sloena.gal-fella.com` に反映。

## 完了条件チェックリスト
- [ ] `src/data/machines.json` が17機種版に更新済み
- [ ] `src/data/god-kamigami.json` が完全データに置き換え済み(status: "ready")
- [ ] `src/data/okidoki-gold.json` が新規作成(status: "ready")
- [ ] `src/data/okidoki-black.json` が新規作成(status: "ready")
- [ ] `src/data/index.ts` の machineModules に2機種追加
- [ ] `npm run build` 成功
- [ ] ホーム画面で17機種表示
- [ ] GOD / 沖ドキGOLD / 沖ドキBLACK の3機種詳細画面が正常動作
- [ ] mainブランチに push 済み
- [ ] GitHub Actions のデプロイ成功

## 補足: データの考え方
- 沖ドキ系は「モードベース」の機種なので、ゲーム数天井に加えて有利区間天井も併用
- GODは「ループストック型AT」、天井恩恵に複数パターンあり
- evTables の数値は altema / なな徹 / スロベース / たられば 等の解析・実戦値ベース
- 機種ごとに数値の信頼性に差があるので、ユーザーは現場で実戦値を参照する想定
