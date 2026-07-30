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

function gnomeSort(s, N) {
    let i = 0;
    while (i < N) {
        for (let k = 0; k < N; k++) {
            print(s[k] + " ");
        }
        print("\n");

        if (i === 0 || s[i - 1] <= s[i]) {
            i++;
        } else {
            const temp = s[i];
            s[i] = s[i - 1];
            s[i - 1] = temp;
            i--;
        }
    }
}

function main() {
    // const s = [5, 4, 8, 2, 7, 0, 1];
    // const N = 7;
    const s = [4, 5, 2, 8, 7, 10, 8, 1, -10, -4, 9, 3, 0, 12, 0, 2, 100, -100, 2];
    const N = 19;

    gnomeSort(s, N);
    for (let k = 0; k < N; k++) {
        print(s[k] + " ");
    }
    print("\n");
}

main();
