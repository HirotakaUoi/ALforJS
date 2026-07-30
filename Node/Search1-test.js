// ====== 共通の入出力機能（Node.js専用）======
// print(s)  : C++の cout << 相当（改行なし出力）
// input(msg): C++の cin >> 相当（同期入力）
function print(s) {
    process.stdout.write(String(s));
}

function input(msg) {
    print(msg);
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
}
// ==========================================

function main() {
    const s = [3, 5, 2, 8, 7, 1, 9, 0, 10, 4];
    const N = 10;

    const d = parseInt(input("Input: "), 10);

    for (let i = 0; i < N; i++) {
        if (d === s[i]) {
            print("Found at: " + i + "\n");
            return;
        }
    }
    print("I can't find\n");
}

main();
