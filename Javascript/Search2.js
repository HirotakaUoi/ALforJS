// ====== 共通の入力機能（変更しない）======
// Node.js・ブラウザ両対応の同期入力（C++の cin >> 相当）
// Node.jsでは標準入力から1行だけ読み、ブラウザでは入力ダイアログを出す
const input = (typeof window !== 'undefined')
    ? (msg) => window.prompt(msg)
    : (msg) => {
        process.stdout.write(msg);
        const fs = require('fs');
        const buf = Buffer.alloc(1);
        const bytes = [];
        while (true) {
            let n;
            try {
                n = fs.readSync(0, buf, 0, 1);      // 1バイトずつ読む
            } catch (e) {
                if (e.code === 'EAGAIN') continue;  // パイプでまだデータが来ていない間は待つ
                throw e;
            }
            if (n === 0) break;                     // EOF
            if (buf[0] === 10) break;               // '\n' が来たら1行の終わり
            bytes.push(buf[0]);
        }
        return Buffer.from(bytes).toString('utf-8').trim();
    };
// ========================================

function main() {
    const s = [4, 5, 2, 8, 7, 1, 9, 0, 99999];  //配列の最後にとりあえず 99999 を置いておく
    const N = 8;  // 99999は除いた大きさ

    const d = parseInt(input("Input search number: "), 10);
    s[N] = d;         //配列の最後(99999の位置)にdを置く

    let i = 0;
    while (s[i] !== d) i++;
    if (i === N) {     //iが配列の最後を指していたら…
        process.stdout.write("I can't find: " + d + "\n");
    } else {
        process.stdout.write("Found: " + d + " at index " + i + "\n");
    }
}

main();
