# AL by JS for CC

アルゴリズム教材プロジェクト。`C++` フォルダの C++ ソースコード（ソート・探索・文字列照合など約45本）を、
名前・アルゴリズム・出力形式を変えずに JavaScript（Node.js）へ移植したもの。

## フォルダ構成

- `C++/` — 元の C++ ソース（サブフォルダ `文字列アルゴリズム/` を含む）
- `Javascript/` — 移植した JavaScript ソース（ファイル名は C++ と同名の `.js`）
  - `文字列アルゴリズム/` — BoyerMoore / BruteForceMatching / KMPMatching
  - `両対応サンプル/` — Node.js・ブラウザ両対応の試作（QuickSort1 / BSearch1 / BigSort2 の .js + .html）

## 移植の約束事

- 関数名・変数名・アルゴリズム・出力形式・コメントは C++ 版を維持する
- C++ の整数除算は `Math.floor()` で再現
- クラス・`new Array()` は使わない（配列リテラル `[]` を使用。JSの配列は自動拡張されるため）
- 入力は各ファイル冒頭の共通ブロック「`// ====== 共通の入力機能（変更しない）======`」の同期関数 `input(msg)` を使う
  - Node.js: `fs.readSync(0)` で標準入力から1行読む（`await` 不要・パイプ/対話両対応）
  - ブラウザ: `window.prompt(msg)`
  - 全ファイル完全に同一のブロック。変更する場合は全ファイル一括で
- 時間計測（BigSort2）は `process.hrtime.bigint()` をマイクロ秒換算（`CLOCKS_PER_SEC = 1000000`）
- スレッド（SleepSort1 / QuickSort1P / QuickSort11P）は setTimeout / async + Promise.all で再現
  - この2ファイルの `await` は並行実行の再現用で、入力とは無関係（残してよい）

## 実行方法

- `node Javascript/<ファイル名>.js` — 対話入力・パイプ入力（`echo "5" | node ...`）両方可
- `両対応サンプル/` の `.html` はダブルクリックでブラウザ実行可（サーバー不要）

---

## 作業引き継ぎログ

### 2026-07-13

**やったこと（このプロジェクトの初回セッション）:**

1. `C++/` の全45本（+サブフォルダ3本）を `Javascript/` に移植
   - VSCode一時ファイル `tempCodeRunnerFile.cpp` と `.DS_Store` は対象外
2. C++ 側の誤り2件を修正（JS版も同様に対応済み）
   - `文字列アルゴリズム/BoyerMoore.cpp` — 未定義の `BMSearch` 呼び出し → `BMHSearch` に修正
   - `QuickSort3.cpp` — `main` 内の `int s[]` 二重定義 → 1つ目をコメントアウト
   - 全 C++ ファイルの g++ コンパイルチェック済み（ALL OK）
3. BigSort2.js の時間計測を `Date.now()`（ms）→ `process.hrtime.bigint()`（μs）に変更
4. クラス的な書き方を排除（`new Array(N)` → `[]`、SleepSort1 の Promise → 素の setTimeout）
5. `両対応サンプル/` を新設（Node・ブラウザ両対応の試作3本 + HTML）
   - ユーザーが BigSort2.js（サンプル側）に BubbleSort 計測を追加、prettier 整形あり
6. 入力の共通化：入力を使う21ファイル全部を同期 `input()` 方式に統一
   - ユーザー提案の `readFileSync(0)` 案は「2回入力で破綻」「対話でCtrl+D必要」のため
     `fs.readSync(0)` の1行読み方式に改良して採用
   - これにより入力用途の async/await・readline・makeReader を全廃

**次回への注意:**

- 全ファイル検証済み（構文チェック＋実行テスト）。既知の未完了タスクなし
- ブラウザペイン（プレビュー）は `prompt()` ダイアログが自動化を塞いで応答不能になることがある。
  ブラウザ確認はユーザーの手元で HTML をダブルクリックしてもらう方が確実
- `両対応サンプル/` 以外の `Javascript/` 本体は出力が `process.stdout.write`（Node専用）のまま。
  ブラウザでも動かすなら出力の `print()` 共通化が別途必要（サンプル参照）
- git リポジトリはこのセッションで初期化（リモート未設定・push なし）
