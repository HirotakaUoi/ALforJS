# AL by JS for CC

アルゴリズム教材プロジェクト。`C++` フォルダの C++ ソースコード（ソート・探索・文字列照合など約45本）を、
名前・アルゴリズム・出力形式を変えずに JavaScript（Node.js）へ移植したもの。

## 目標

1. **アルゴリズムの本質部分はどの環境でも統一** — Node でもブラウザでも同じ書き方
2. **Node版が授業のメイン実行環境** — VSCode で動かす（デバッグしやすいため）
3. **サブ実行環境としてブラウザ版を併用** — コード欄に Node版をそのまま貼れば動く

最終的にソースはスライドに表示する用途で、配布はしない。

## フォルダ構成

- `C++/` — 元の C++ ソース（参考用。**手を入れない**）
- `Node/` — **標準版**。全45本＋共通ライブラリ。VSCode で動かすメイン環境
  - `io.js` — 共通の入出力ライブラリ。`output` / `input` / `close` / `clock` / `CLOCKS_PER_SEC` を
    `globalThis` に登録するので、各プログラムは `require("./io.js");` の1行だけで済む
  - `文字列アルゴリズム/` — BoyerMoore / BruteForceMatching / KMPMatching
    - 同フォルダの `io.js` は `../io.js` への中継。これで共通ブロックが45本すべて同一になる
  - `globals.d.ts` — エディタの補完用（実行には関与しない）
- `Web/` — ブラウザ実行環境。`Node/` のソースを貼り付けて動かす
  - `html.html` — **HTML版**。テキスト入出力のみ。外部ライブラリ不要でオフラインでも動く
  - `p5.html` — **p5.js版**。HTML版＋描画キャンバス
  - `io.js` — ブラウザ版の共通入出力ライブラリ（`Node/io.js` と対）
  - `runner.js` / `runner.css` — 実行エンジンとスタイル（2ページで共用）
  - `index.html` — 入口
- `tools/aligncomments.js` — `Node/` のコメント位置を揃える（`node tools/aligncomments.js`）

## プログラムの書き方（全45本で統一）

```js
// ====== 共通の入出力機能（変更しない）======
require("./io.js");
// ==========================================

async function main() {
    const d = parseInt(await input("Input search number: "), 10);
    output("...");
}

main().finally(close);
```

- 共通ブロック3行と末尾行は**全45ファイル完全に同一**（入力を使わないファイルも例外なく）
- `output(s)` — cout 相当の改行なし出力。**`print` ではない**（p5.js がグローバルの `print` を
  自分のもので上書きしてしまうため。`output` は p5 とも `window` とも衝突しない）
- `input(msg)` — cin 相当。Promise を返すので **必ず `await input(...)`**、`main()` は `async`
  （ブラウザではキーボード入力を同期で待てないため、両環境とも async に統一）
- `close()` — 標準入力を閉じる。呼ばないと対話実行時にプロセスが終わらない
- `clock()` / `CLOCKS_PER_SEC` — BigSort2 の時間計測用。`io.js` が提供する
- `isNode` は使わない（環境差は `io.js` が吸収する）

## 移植の約束事

- 関数名・変数名・アルゴリズム・出力形式・コメントは C++ 版を維持する
- C++ の整数除算は `Math.floor()` で再現
- クラス・`new Array()` は使わない（配列リテラル `[]` を使用。JSの配列は自動拡張されるため）
- スレッド（SleepSort1 / QuickSort1P / QuickSort11P）は setTimeout / async + Promise.all で再現
- コメント位置の規則（`tools/aligncomments.js` が適用。詳細はファイル冒頭に記載）
  - 行末コメントは空行で区切られたブロックごとに同じ桁へ。突出して長い行（2番目より8桁以上長い）は基準から外す
  - コメントアウトされた初期配列（`const s` / `const N`）は行頭1桁目から
  - タブは半角4スペースに展開（スライド表示でタブ幅がぶれるため）

## 実行方法

- **Node**: `node Node/<ファイル名>.js` — 対話入力・パイプ入力（`echo "5" | node ...`）両方可
- **ブラウザ**: `Web/index.html` をダブルクリック → HTML版 / p5.js版 を選ぶ（サーバー不要）
  - `Node/` のソースを**まるごと**コード欄に貼れば動く。`require` 行と末尾の `main()` 呼び出しは
    実行環境が自動で取り除く
  - 実行 = Ctrl/Cmd + Enter、中止 = Esc。書いたコードは `localStorage` に自動保存
  - キャンバスは既定で非表示。`createCanvas()` が呼ばれると自動で開く（実行1回につき1度だけ）
  - p5.js の URL とアクセント色は「設定」から変更可（オフライン用にローカルパスも指定できる）

---
## 作業引き継ぎログ

### 2026-08-19

**やったこと（構成を大きく変えたセッション）:**

1. **コメント位置の整形規則を確立**（`tools/aligncomments.js`）
   - 行末コメントは空行区切りのブロックごとに揃える。突出して長い行は基準から外してはみ出させる
   - コメントアウトされた初期配列は行頭から。タブは半角4スペースに展開
   - 規則は3回作り直して現在の形に落ち着いた（全体53桁固定 → 連続行ごと → ブロックごと＋外れ値除外）
2. **両対応版（`Javascript/`）を廃止し、`Node/` を標準に**
   - 動機: `Javascript/` は同期 `input()`、`Node/` は `await input()` で**アルゴリズム本体が違っていた**。
     目標1（本質部分の統一）を満たすには async に寄せる必要があった
   - 共通ブロック45行 → `require("./io.js");` の1行に。`isNode` は全廃
   - `print` → `output` に改名（p5.js がグローバルの `print` を奪うため。実測で確認済み）
   - 検証: 移行前後で45本を実行し39本が出力完全一致、不一致ゼロ（残る6本は乱数使用で旧版どうしでも不一致）
3. **`Web/` にブラウザ実行環境を新設**（HTML版・p5.js版の2つ、共通ライブラリ方式）
   - sandbox付き iframe で実行し、実行のたびに作り直すので状態が残らない
   - 中止ボタン（Esc）、キャンバスの自動開閉、日本語エラー要約、設定画面、コード自動保存
4. `Javascript/` と不要になったツール（`build-node.js` `genhtml.js` `genplayground.js` `transform*.js` ほか）を削除

**技術的に確定したこと（再調査不要）:**

- **p5.js はグローバルの `print` を上書きする**が、`output` には触らない（実測済み）。改名で根本解決した
- **アプリ内ブラウザは動的に作った `sandbox` 付き iframe のスクリプトを実行しない**（`cloneNode` も同様）。
  そのため iframe は元の要素を外して付け直す方式にしてある。**Safari/Chrome では問題なく動くことを実機で確認済み**
- 無限ループからの復帰も**実ブラウザでは問題なし**（アプリ内ブラウザでのみ、暴走中の iframe が
  プロセスを塞いで復帰できなかった）。念のため実行環境は `ready` 応答の有無で異常を検知し、
  ページ再読み込みを案内する保険を残してある（コードは自動保存されるので失われない）
- ブラウザペインが非表示だと `requestAnimationFrame` が止まるため、p5 の `draw()` は動かない。
  スクリーンショットを撮ると動き出す（自動検証時の注意）

**次回への注意:**

- この環境の Node は `/opt/homebrew/bin/node`（v26.5.1）。**セッション開始時の `which node` では
  見つからないことがある**が、`command -v node` なら見つかり実行もできる
- `tools/aligncomments.js` は node で実行して検証済み（以前のセッションで作った Python 代替は不要になった）
- `Web/index.html` を Safari/Chrome でダブルクリックしたときの動作は**ユーザー確認済み・問題なし**
  （`file://` での iframe 実行、p5.js の読み込み、無限ループからの復帰とも）
- p5.js は CDN の `p5@2`（2.3.2）が既定。オフラインで使うなら `Web/lib/` に置いて設定画面でパスを変更する
- `C++/` は参考用として触らない方針


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
