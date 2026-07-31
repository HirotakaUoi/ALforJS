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

function rand() { return Math.floor(Math.random() * 2147483648); }

function shuffle(s, N) {
    let k, temp;

    for (let i = N - 1; i > 0; --i) {
        k = rand() % (i + 1);
        temp = s[i];
        s[i] = s[k];
        s[k] = temp;
    }
}

function bogoSort(s, N) {
    let count = 1;
    let swapped;

    while (true) {
        for (let k = 0; k < N; k++) {
            print(s[k] + " ");
        }
        print("Count=" + count++ + "\n");
        swapped = false;
        for (let i = 0; i < N - 1; i++) {
            if (s[i] > s[i + 1]) {
                swapped = true;
                break;
            }
        }
        if (!swapped) break;
        shuffle(s, N);
    }
}

function main() {
    const s = [4, 5, 2];
    const N = 3;
    // const s = [4, 5, 2, 9, 3];
    // const N = 5;
    // const s = [4, 5, 2, 7, 1, 9, 3];
    // const N = 7;
    // const s = [4, 5, 2, 8, 7, 1, 9, 3, 0];
    // const N = 9;
    // const s = [4, 5, 8, 2, 7, 1, 9, 0, 3, 10];
    // const N = 13;

    bogoSort(s, N);
    for (let k = 0; k < N; k++) {
        print(s[k] + " ");
    }
    print("\n");
}

main();
//	const s = [4, 5, 2, 8, 7, 10, 8, 1, 9, 3, 0, -1, -2];
//	const s = [4, 5, 2, 8, 7, 10, 8, 1, -10, -4, 9, 3, 0, 12, 0, 2, 100,-100,2];
