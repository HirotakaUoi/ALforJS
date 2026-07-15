# AL by JS for CC

アルゴリズム教材プロジェクト。`C++` フォルダの C++ ソースコード（ソート・探索・文字列照合など約45本）を、
名前・アルゴリズム・出力形式を変えずに JavaScript（Node.js）へ移植したもの。

## フォルダ構成

- `C++/` — 元の C++ ソース（サブフォルダ `文字列アルゴリズム/` を含む）
- `Javascript/` — 移植した JavaScript ソース（ファイル名は C++ と同名の `.js`、全ファイル Node.js・ブラウザ両対応）
  - `文字列アルゴリズム/` — BoyerMoore / BruteForceMatching / KMPMatching
  - `html/` — ブラウザ実行用ページ（全プログラム分を自動生成。`index.html` が一覧）
  - `両対応サンプル/` — 両対応方式の初期試作（QuickSort1 / BSearch1 / BigSort2 の .js + .html）。本体が両対応になったので参考用

## 移植の約束事

- 関数名・変数名・アルゴリズム・出力形式・コメントは C++ 版を維持する
- C++ の整数除算は `Math.floor()` で再現
- クラス・`new Array()` は使わない（配列リテラル `[]` を使用。JSの配列は自動拡張されるため）
- 入出力は各ファイル冒頭の共通ブロック「`// ====== 共通の入出力機能（変更しない）======`」を使う
  - `print(s)` — cout 相当の改行なし出力（Node: `process.stdout.write` ／ ブラウザ: `#output` 要素に追記）
  - `input(msg)` — cin 相当の同期入力（Node: `fs.readSync(0)` で1行読み・`await` 不要 ／ ブラウザ: `window.prompt`）
  - 全45ファイル完全に同一のブロック。変更する場合は `tools/transform.js` を修正して全ファイル一括で
- 時間計測（BigSort2）の `clock()` はマイクロ秒を返す両対応
  （Node: `process.hrtime.bigint()` 換算 ／ ブラウザ: `performance.now()` 換算。`CLOCKS_PER_SEC = 1000000`）
- スレッド（SleepSort1 / QuickSort1P / QuickSort11P）は setTimeout / async + Promise.all で再現
  - この2ファイルの `await` は並行実行の再現用で、入力とは無関係（残してよい）

## 実行方法

- `node Javascript/<ファイル名>.js` — 対話入力・パイプ入力（`echo "5" | node ...`）両方可
- ブラウザ: `Javascript/html/index.html` をダブルクリック → 一覧から選んで実行（サーバー不要）

---

## 作業引き継ぎログ

### 2026-07-14

**やったこと：**

1. 出力もブラウザ対応に統一（全45ファイル）
   - 共通ブロックを「共通の入出力機能」（`input()` + `print()`）に拡張
   - `process.stdout.write(...)` → `print(...)`、SleepSort1 の `console.log` → `print()` に一括置換
   - BigSort2 の `clock()` を環境判定つき両対応に（Node: hrtime ／ ブラウザ: performance.now）
2. `Javascript/html/` を新設 — 全45プログラムのブラウザ実行ページ + `index.html`（一覧）を自動生成
   - 生成スクリプトは `tools/genhtml.js`（プログラム追加時は `node tools/genhtml.js` で再生成）
   - 共通ブロックの一括変換スクリプトも `tools/transform.js` として保存
3. ブラウザで BigSearch1 / BigSort1 / BigSort2 が表示されない問題を修正
   - 原因: ページ読み込み中の prompt() ＋ `textContent +=` が出力量の2乗コストで固まる
   - 対策1: 自動実行をやめ、末尾を `if (isNode) main();` に（ブラウザはページの「実行」ボタンから起動）
   - 対策2: print() のブラウザ側を `appendChild(createTextNode(...))` に変更（大量出力でも1回あたり一定コスト）
   - 適用スクリプト: `tools/transform2.js`（全45ファイル一括）。HTMLも「実行」ボタン方式で再生成
   - 検証: vm による擬似ブラウザ環境（`tools/../` 相当はスクラッチパッド）で
     読み込み時に自動実行されないこと・ボタン相当の main() で正しく動くことを確認。Node側も全数回帰テスト PASS

4. VSCode内蔵ブラウザ対応：ページ上の入力欄（`id="stdin"`）方式を追加
   - VSCode内蔵ブラウザ（webview）は `window.prompt()` のダイアログが出ない（null が返る）ことが判明
   - input() のブラウザ側を「入力欄に値があればそこから1行ずつ読む → 空なら prompt() にフォールバック」に変更
   - 入力欄は入力を使う21プログラムのページにだけ生成（`input("` の有無で判定）
   - 「実行」ボタンが `window._stdin = null` でリセットするので再実行も可
   - 適用スクリプト: `tools/transform3.js`

**次回への注意：**

- ファイル末尾は `main();` ではなく `if (isNode) main();` が正（ブラウザではHTML側のボタンが呼ぶ）
- ブラウザの入力は「入力欄（VSCode内蔵ブラウザは必須）→ 空なら prompt()」の2段構え
- ユーザーの手元での実機ブラウザ確認はまだ（ブラウザペインは自動化が塞がるため確認不可）
- 両対応サンプル/ は旧方式（読み込み時自動実行）のまま。参考用なので未変更
- リモート設定済み: https://github.com/HirotakaUoi/ALforJS （公開リポジトリ）。
  /save ではコミット後に origin/main へ push する
- p5.js 化は検討の上で見送り（可視化は姉妹プロジェクト AA by Python for CC の領分。
  こちらは C++ と1対1のテキスト教材に徹する）

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
- git リポジトリはこのセッションで初期化（リモート未設定・push なし）
