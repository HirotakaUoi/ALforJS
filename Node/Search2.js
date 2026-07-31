// ====== 共通の入出力機能（Node.js専用・ASCII入力前提）======
// print(s)  : C++の cout << 相当（改行なし出力）
// input(msg): C++の cin >> 相当（同期入力）
function print(s) {
    process.stdout.write(String(s));
}

function input(msg) {
    print(msg);
    const fs = require('fs');
    const buf = Buffer.alloc(1);
    let line = '';
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
        line += String.fromCharCode(buf[0]);
    }
    return line.trim();
}
// ==========================================

function main() {
    const s = [4, 5, 2, 8, 7, 1, 9, 0, 99999];  //配列の最後にとりあえず 99999 を置いておく
    const N = 8;  // 99999は除いた大きさ

    const d = parseInt(input("Input search number: "), 10);
    s[N] = d;         //配列の最後(99999の位置)にdを置く

    let i = 0;
    while (s[i] !== d) i++;
    if (i === N) {     //iが配列の最後を指していたら…
        print("I can't find: " + d + "\n");
    } else {
        print("Found: " + d + " at index " + i + "\n");
    }
}

main();
