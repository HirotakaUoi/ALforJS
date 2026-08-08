# AL by JS for CC

アルゴリズム教材プロジェクト。`C++` フォルダの C++ ソースコード（ソート・探索・文字列照合など約45本）を、
名前・アルゴリズム・出力形式を変えずに JavaScript（Node.js）へ移植したもの。

## フォルダ構成

- `C++/` — 元の C++ ソース（サブフォルダ `文字列アルゴリズム/` を含む）
- `Javascript/` — 移植した JavaScript ソース（ファイル名は C++ と同名の `.js`、全ファイル Node.js・ブラウザ両対応）
  - `文字列アルゴリズム/` — BoyerMoore / BruteForceMatching / KMPMatching
  - `html/` — ブラウザ実行用ページ（全プログラム分を自動生成。`index.html` が一覧）
  - `両対応サンプル/` — 両対応方式の初期試作（QuickSort1 / BSearch1 / BigSort2 の .js + .html）。本体が両対応になったので参考用
  - `playground/` — 対話中に一時停止してターミナル風に入力できる単一HTMLの試作（Generatorベース、Node不要）。現状 BSearch1.html のみ
  - `p5/` — p5.js関連の別件・作業中（未追跡、`tools/build-node.js`の対象外）
- `Node/` — `Javascript/` から自動生成した Node.js専用版（全45本、ブラウザ分岐を除去）。`Javascript/` は両対応版のまま維持し、`Node/` はその派生
  - 再生成: `node tools/build-node.js`（`Javascript/` 側を修正したら実行し直す。手動で直接編集しない）
  - `input()` は標準モジュール `readline`（非promise版）を使う非同期版
    - ファイル冒頭で `readline.Interface` を1つだけ作り、`rl[Symbol.asyncIterator]()` で1行ずつ受け取る
    - `rl.question()` をその都度作り直す方式は、複数行を一度にパイプ入力すると2回目以降が読めなくなる不具合があったため不採用
  - 共通ブロック・末尾行とも**全45ファイル完全に同一**（`input()`を使わないファイルも例外なく `async function main()` + `main().finally(() => rl.close());`）
    - 未使用でも `rl` を確実に閉じないと対話実行時にプロセスが終了しなくなるため、使う/使わないで分岐させていない
  - `Javascript/playground/` — 対話中に一時停止してターミナル風に入力できる単一HTMLの試作（Generatorベース、Node不要）。現状 BSearch1.html のみ

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

### 2026-08-08

**やったこと：**

1. `Javascript/BubbleSort1.js` / `BubbleSort2.js` / `Search1.js` の共通ブロックがさらに変化
   - インデント2スペース・ダブルクォートへの整形（prettier風）に加え、今回は機能面でも変化あり
     - `input()`のNode側：EAGAIN時のリトライ（`try/catch`でパイプ未到達データを待つ処理）を削除し、
       単純な `while (fs.readSync(...) && buf[0] !== 10)` ループに簡略化
     - `require('fs')` を関数内から出し、ファイル冒頭で `const fs = isNode ? require('fs') : null;` に
     - `print()`のブラウザ側：`appendChild(createTextNode(...))` → `element.append(...)` に簡略化
   - 正規の共通ブロック（他42本、例: `Javascript/BSearch1.js`）は変更前のまま（EAGAIN対応・appendChild方式を維持）で、
     乖離は書式だけでなく挙動にも及ぶ状態になっている。**この3本の扱いは依然未確認・未コミットのまま据え置き**
     （正規ブロックをこちらに合わせて`tools/transform.js`で全体更新するか、3本を正規ブロックに戻すか要判断）
2. `Javascript/playground/BSearch1.html` を試作から汎用プレイグラウンドへ拡張
   - タイトルを「BSearch1（二分探索）プレイグラウンド」→「アルゴリズム プレイグラウンド」に変更
   - ソース欄を `<pre>`（表示のみ）から `<textarea>`（編集可能）に変更し、`実行`時に`eval`で反映
   - `main`の3形態に対応：`function* main()`（input()で一時停止）／`async function main()`（並列スレッド模擬）／
     通常の`function main()`（入力なし、SleepSort1のsetTimeoutもここに含む）。`kindOf()`で判別し駆動方法を切り替え
   - SleepSort1のような「setTimeoutを仕掛けてすぐreturnする」プログラム対策として、実行世代（`runGeneration`）を導入
     し、再実行・リセット時に古い世代のタイマー発火を無視するよう対応（`window.setTimeout`はグローバルのまま維持し、
     ローカルの`const setTimeout`でラップすることで無限再帰を回避）
   - 実行時エラー（構文エラー・実行時例外）をターミナルに表示するように対応（`finishWithError`）
   - ソースコード欄には`main()`のみ表示（`print`/`input`は環境提供ライブラリとして非表示に）
   - 引き続きBSearch1のみの試作段階。45本への展開や`html/`との統合方針は未確定

**次回への注意：**

- `Javascript/BubbleSort1.js` / `BubbleSort2.js` / `Search1.js` の共通ブロックの扱いを次回決める
  （正規ブロックとの乖離が機能面にも拡大したため、放置期間が長引くほど「どちらが正か」の判断が難しくなる）
- `Javascript/p5/` は今回も触っていない（ユーザーが別途作業中）
- `Javascript/playground/` は BSearch1.html のみだが、任意のプログラムを貼り付けて動かせる汎用プレイグラウンドに近づいた。
  他44本への展開や `html/` との統合方針は未確定

### 2026-08-05

**やったこと：**

1. 実行環境に Node.js が使えるようになったので、`tools/build-node.js` を実際に実行して検証
   - 前回セッションでPython代替生成した `Node/` と完全一致することを確認（生成ロジックの正しさを実機で裏付け）
2. `Node/` の `input()`（`readline/promises` の `question()` を呼び出しごとに作り直す方式）に不具合を発見
   - 症状: `printf "10\n5\n" | node Node/BigSearch1.js` のように複数行を一度にパイプすると、
     2回目以降の `input()` が永久に応答を受け取れず、結果が出ないままプロセスが終了する
   - 対話的に1行ずつ打つ場合や、1回だけの入力パイプ（`echo "5" | node ...`）は問題なし。
     複数行を一度にまとめてパイプする場合のみ発生（自動テストや `printf` での一括投入で踏みやすい）
   - 原因: `rl.question()` 用に `readline.Interface` を呼び出しごとに作り直すと、
     パイプで既にバッファされている2行目以降を新しいインターフェースが受け取れない（Node側の挙動）
   - 対策: `readline.Interface` をファイル冒頭で1つだけ作り、非同期イテレータ（`rl[Symbol.asyncIterator]()`）で
     1行ずつ受け取る方式に変更。複数行一括パイプ・遅延パイプ（対話相当）の両方で修正確認済み
   - ユーザー要望で「共通ブロックは全45ファイル完全に同一」を維持するため、
     `input()`を使わない24本も含めて全ファイル一律 `async function main()` にし、
     末尾を `main().finally(() => rl.close());` に統一（未使用でも`rl`を閉じないと対話実行時にハングするため）
   - 全45本を実行して無エラー・exit 0、共通ブロック・末尾行のユニーク文字列が1種類のみであることを検証済み
3. `Javascript/playground/BSearch1.html` を試作 — 単一HTMLでソースコード表示＋ターミナル風の実行パネル
   - `input()`呼び出しで実行が一時停止し、ターミナル内の入力欄に打ってEnterで続きが動く体験
   - 実現方式は Generator（`function* main()` + `yield* input(msg)`）。Web Worker + Atomics.wait も検討したが、
     `SharedArrayBuffer`がクロスオリジン分離ヘッダー必須で `file://` 直開き・VSCode内蔵ブラウザでは動かない可能性が高く不採用
   - print/input の「ライブラリ」関数もHTML内に埋め込み、ソース表示欄には実際に実行される関数をそのまま`toString()`して表示
   - 対象はBSearch1のみの試作。他プログラムへの展開は未着手

**次回への注意：**

- `Javascript/BubbleSort1.js` / `BubbleSort2.js` / `Search1.js` の3本は依然未コミットのまま（方針未確認、据え置き）
- `Javascript/p5/` は今回も触っていない（ユーザーが別途作業中）
- `Javascript/playground/` は BSearch1.html のみの試作段階。45本への展開や `html/` との統合方針は未確定
- リモートは origin（ALforJS）のみ。一時追加した albyjs4cc は前セッションで削除済み

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
