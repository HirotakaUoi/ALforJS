# AL by JS for CC

アルゴリズム教材プロジェクト。`C++` フォルダの C++ ソースコード（ソート・探索・文字列照合など約45本）を、
名前・アルゴリズム・出力形式を変えずに JavaScript（Node.js）へ移植したもの。

## フォルダ構成

- `C++/` — 元の C++ ソース（サブフォルダ `文字列アルゴリズム/` を含む）
- `Javascript/` — 移植した JavaScript ソース（ファイル名は C++ と同名の `.js`、全ファイル Node.js・ブラウザ両対応）
  - `文字列アルゴリズム/` — BoyerMoore / BruteForceMatching / KMPMatching
  - `html/` — ブラウザ実行用ページ（全プログラム分を自動生成。`index.html` が一覧）
  - `両対応サンプル/` — 両対応方式の初期試作（QuickSort1 / BSearch1 / BigSort2 の .js + .html）。本体が両対応になったので参考用
- `Node/` — `Javascript/` から自動生成した Node.js専用版（全45本、ブラウザ分岐を除去）。`Javascript/` は両対応版のまま維持し、`Node/` はその派生
  - 再生成: `node tools/build-node.js`（`Javascript/` 側を修正したら実行し直す。手動で直接編集しない）
  - `input()` は標準モジュール `readline/promises` を使う非同期版（`fs.readSync`のバイトループではない）
    - `input()` を呼ぶファイル（21本）だけ `main()` を `async` 化し、呼び出し箇所は `await input(...)`
    - `input()` を呼ばないファイル（24本）は無変更のまま同期の `main()` （`input()`定義自体は共通ブロックとして残るが未使用）
    - 末尾は async化していても `main();` の素呼び出しのまま（`QuickSort1P.js`/`QuickSort11P.js`と同じ流儀。`.catch`等のエラー処理は付けない）

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
- `node Node/<ファイル名>.js` — 上と同じだが Node.js専用版（ブラウザ分岐なし）
- ブラウザ: `Javascript/html/index.html` をダブルクリック → 一覧から選んで実行（サーバー不要）

---

## 作業引き継ぎログ

### 2026-08-02

**やったこと：**

1. `Node/` の `input()` を2段階で見直し
   - まず ASCII入力前提でバイト配列＋`Buffer.from().toString('utf-8')`をやめ、
     1バイトずつ文字列へ直接連結する方式に簡略化
   - さらに標準モジュール `readline/promises` を使う非同期版に変更（`fs.readSync`のバイトループ自体を廃止）
     - `input()` を呼ぶ21本のみ `main()` を `async` 化し、呼び出し箇所を `await input(...)` に
     - 呼ばない24本は無変更。`QuickSort1P.js`/`QuickSort11P.js`は元々asyncなので影響なし
     - 末尾は async化後も `main();` の素呼び出しのまま（エラーハンドリングは付けない、既存の流儀を踏襲）
   - `tools/build-node.js` を都度更新し、`Node/` 全45本を再生成
2. `Javascript/p5/`（p5.js関連、`common/viz.js`など）という未追跡の作業中フォルダを発見
   - ユーザー確認の上、放置と判断。`tools/build-node.js` の生成対象からは除外（`html/`・`両対応サンプル/`と同様）
3. リモート `albyjs4cc`（https://github.com/HirotakaUoi/ALbyJS4CC.git）を一時追加してpushしたが、
   ユーザーが「origin(ALforJS)と重複していた」と気づき削除。以降 origin のみ使用

**次回への注意：**

- このセッションの実行環境に Node.js が入っておらず、`tools/build-node.js` は一度も実際には実行できていない
  （同ロジックをPythonで再実装して検証・生成。次回nodeが使える環境で一度 `node tools/build-node.js` を実行し、
  既存の `Node/` と一致するか確認するとより安全）
- `Javascript/BubbleSort1.js` / `BubbleSort2.js` / `Search1.js` の3本は前々セッションから未コミットのまま
  （共通ブロックがprettier風に整形されている以外は機能的に他42本と同一。方針未確認）
- `Javascript/p5/` は今回のNode/生成対象外のまま。ユーザーが別途作業中なので触らないこと

### 2026-07-31

**やったこと：**

1. `Javascript/`（両対応版）から Node.js専用版を生成する `Node/` フォルダを新設（全45本）
   - 共通入出力ブロックからブラウザ分岐（`window.prompt` / `document.getElementById` 等）を除去
   - BigSort2.js の `clock()` から `performance.now()` 分岐を除去（Node の `hrtime.bigint()` のみに）
   - 末尾の `if (isNode) main();` を `main();` に
   - 生成スクリプト: `tools/build-node.js`（`Javascript/` を直接コピー元とし、`両対応サンプル/` と `html/` は対象外）
   - `Javascript/` 側は両対応版のまま変更なし。`Node/` を再生成する場合は `node tools/build-node.js` を実行

**次回への注意：**

- このセッションの実行環境に Node.js が入っておらず、`tools/build-node.js` 自体は未実行（作れなかった）。
  同ロジックを Python で再実装して `Node/` の45ファイルを生成・検証済み（本文の差分は共通ブロックとclock()と末尾行のみで、
  ロジック部分はJavascript/側とバイト単位で一致することを確認、丸括弧・波カッコの対応も全数チェック済み）
- `tools/build-node.js` はPython版と同じロジックで書き直したが、Node.js環境で一度も実行できていない。
  次回 node が使える環境で `node tools/build-node.js` を実行し、既存の `Node/` の内容と一致するか確認するとより安全
- `Javascript/BubbleSort1.js` / `BubbleSort2.js` / `Search1.js` の3本は前セッションから未コミットのまま
  （共通ブロックがprettier風に整形されている以外は機能的に他42本と同一。方針未確認）

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
