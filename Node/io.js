// ====== 共通の入出力機能（Node.js専用・変更しない）======
// output(s) : C++の cout << 相当（改行なし出力）
// input(msg): C++の cin >> 相当（1行受け取って、そのまま返す）
//
// 標準入力から1バイトずつ読み、改行が来るまでをためて1行にする。
// readline と違って標準入力を開いたままにしないので、プログラムの最後で
// 閉じる必要がない（main(); だけで終われる）。
// 名前などに日本語が入ることもあるので、バイトをためてから UTF-8 として読み直す。
import fs from 'node:fs';

function output(s) {
    process.stdout.write(String(s));
}

function input(msg) {
    output(msg);
    const buf = Buffer.alloc(1);
    const bytes = [];
    for (;;) {
        let n;
        try {
            n = fs.readSync(0, buf, 0, 1, null);
        } catch (e) {
            // 端末からの入力がまだ届いていないとき（EAGAIN）は、来るまで待って読み直す
            if (e.code === 'EAGAIN') continue;
            if (e.code === 'EOF') break;
            throw e;
        }
        if (n === 0 || buf[0] === 10) break;      // 入力の終わり、または改行
        bytes.push(buf[0]);
    }
    return Buffer.from(bytes).toString('utf8').trim();
}

// output / input を書き出す。各プログラムの共通部分は
// import { output, input } from "./io.js"; の1行で済む。
// ブラウザの実行環境にも同じ名前の2つがあるので、書き方は両環境で同じになる。
// 時間計測は Node にもブラウザにもある performance.now() をそのまま使うので、
// ここでは用意しない
export { output, input };
