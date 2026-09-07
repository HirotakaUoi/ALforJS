// ====== 共通の入出力機能（Node.js専用・変更しない）======
// output(s)  : C++の cout << 相当（改行なし出力）
// input(msg): C++の cin >> 相当（1行受け取る。呼び出し側は await input(...)）
// close()   : 標準入力を閉じる。プログラムの最後で main().finally(close) として呼ぶ
//             （閉じないと対話実行のときプロセスが終わらない）
//
// readline.Interface はこのファイルで1つだけ作り、非同期イテレータで1行ずつ受け取る。
// 呼び出しごとに作り直すと、複数行を一度にパイプしたとき2行目以降が読めなくなる。
import readline from 'node:readline';
const rl = readline.createInterface({ input: process.stdin, terminal: false });
const _lines = rl[Symbol.asyncIterator]();

function output(s) {
    process.stdout.write(String(s));
}

async function input(msg) {
    output(msg);
    const { value } = await _lines.next();
    return (value ?? '').trim();
}

function close() {
    rl.close();
}

// output / input / close を書き出す。各プログラムの共通部分は
// import { output, input, close } from "./io.js"; の1行で済む。
// ブラウザの実行環境にも同じ名前の3つがあるので、書き方は両環境で同じになる。
// 時間計測は Node にもブラウザにもある performance.now() をそのまま使うので、
// ここでは用意しない
export { output, input, close };
