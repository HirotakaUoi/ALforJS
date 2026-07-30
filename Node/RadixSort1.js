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

function radixSort(s, N, max) {
    let i, j, k, n;

    // C++の vector<int> b[10] 相当：10個の空配列（配列リテラルで十分）
    const b = [[], [], [], [], [], [], [], [], [], []];

    for (n = 1; n < max; n *= 10) {
        for (i = 0; i < 10; i++) b[i].length = 0;

        for (i = 0; i < N; i++)
            b[Math.floor(s[i] / n) % 10].push(s[i]);

        for (k = 0; k < 10; k++) {
            print(k + ": ");
            for (i = 0; i < b[k].length; i++)
                print(String(b[k][i]).padStart(3, "0") + " ");
            print("\n");
        }
        k = 0;
        for (j = 0; j < 10; j++)
            for (i = 0; i < b[j].length; i++)
                s[k++] = b[j][i];
        for (k = 0; k < N; k++) {
            print(s[k] + " ");
        }
        print("\n");
    }
}

function main() {
    const s = [345, 98, 302, 719, 804, 620, 183, 431, 572];
    const N = 9;
    // const s = new Array(20);
    // const N = 20;
    // for (let i = 0; i < N; i++) {
    //     s[i] = (rand() % 1000);
    // }
    for (let k = 0; k < N; k++) {
        print(s[k] + " ");
    }
    print("\n");
    radixSort(s, N, 1000);
    for (let k = 0; k < N; k++) {
        print(s[k] + " ");
    }
    print("\n");
}

main();
