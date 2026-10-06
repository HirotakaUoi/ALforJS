# ALforJS（AL by JS for CC）

授業「アルゴリズム基礎論」の教材用に、C++ で書かれたアルゴリズムのサンプルプログラム（ソート・探索・文字列照合など）を、**名前・アルゴリズム・出力形式を変えずに** JavaScript へ移植したものです。
Node.js（VSCode）で動かすのが基本で、ブラウザ上の実行環境でも同じソースがそのまま動きます。

**ブラウザ実行環境:** https://js-code-runner.fishbone.jp/

## フォルダ構成

| パス | 内容 |
|---|---|
| `C++/` | 元の C++ ソース（参照用。変更しない） |
| `Node/` | JavaScript 版（全 47 本）。授業で使うメインの実行環境 |
| `Node/io.js` | 共通の入出力ライブラリ（`output` / `input`） |
| `Node/文字列アルゴリズム/` | 力まかせ法・KMP 法・Boyer-Moore 法 |
| `Web/` | ブラウザ実行環境（HTML 版・p5.js 版）。GitHub Pages で公開 |
| `tools/` | コメント位置の整形などの保守用スクリプト、スライド作成用の Apps Script |

## 収録しているプログラム

- **ソート**: バブル・選択・挿入・シェル・クイック（複数版・並列版）・マージ・ヒープ・バケツ・基数・コム・ノーム・パンケーキ・バイトニック・ボゴ・スリープ・ストゥージ ほか
- **探索**: 線形探索（番兵法など）・二分探索
- **再帰**: 階乗・フィボナッチ数
- **文字列照合**: 力まかせ法・KMP 法・Boyer-Moore 法
- **入門**: Hello・繰り返し

## 実行方法

### Node.js

```bash
node Node/BubbleSort1.js
echo "5" | node Node/Search1.js   # パイプでの入力も可
```

### ブラウザ

https://js-code-runner.fishbone.jp/ を開き、HTML 版か p5.js 版を選んで、`Node/` のソースを**まるごと**コード欄に貼り付けて実行します（Ctrl/Cmd + Enter で実行、Esc で中止）。
手元では `Web/index.html` をダブルクリックしても使えます（サーバー不要）。

- `import` の行と末尾の `main();` は実行環境が自動で取り除きます。
- `input()` を待つための `await` / `async` も実行環境が自動で補います。
- p5.js 版では `createCanvas()` を呼ぶと描画キャンバスが開きます。

## プログラムの書き方

全プログラムで、先頭の共通ブロックと末尾の `main();` を統一しています。

```js
// ====== 共通の入出力機能（変更しない）======
import { output, input } from "./io.js";
// ==========================================

function main() {
    const d = parseInt(input("Input search number: "));
    output("...");
}

main();
```

- `output(s)` — `cout` 相当（改行しない）
- `input(msg)` — `cin` 相当。同期的に 1 行読む（`await` は書かない）

### C++ からの移植の約束事

- 関数名・変数名・アルゴリズム・出力形式・コメントは C++ 版のまま
- 配列の大きさ `N` は引数で渡さず、関数の先頭で `const N = s.length;` として受け直す
- C++ の整数除算は `Math.floor()` で再現する
- `rand()` は全ファイル共通の 1 行で用意する（数列は C++ と一致しない）
- スレッドを使うプログラム（SleepSort1・QuickSort1P・QuickSort11P）は `setTimeout` / `async` + `Promise.all` で**書き方だけ**を再現している（JavaScript は単一スレッドなので、並列の挙動は再現されない）

詳しい規則と作業の記録は [CLAUDE.md](CLAUDE.md) にあります。

## 公開

`Web/` に変更を push すると、GitHub Actions（`.github/workflows/pages.yml`）が `Web/` の中身を GitHub Pages に公開します。
