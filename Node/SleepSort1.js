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

function sleepkSort(s, N) {
    for (let i = 0; i < N; ++i) {
        // setTimeoutでスレッドの代わりにタイマーを作成
        // （Node.jsはすべてのタイマーが終わるまでプロセスを終了しないので、
        //   C++のようなjoin（スレッドの終了待ち）は不要）
        setTimeout(() => {
            print(s[i] + "\n");
        }, s[i] * 1000);
    }
}

function main() {
    const s = [30, 9, 5, 15, 8, 6, 1];
    const N = 7;

    for (let k = 0; k < N; k++) {
        print(s[k] + " ");
    }
    print("\n");

    sleepkSort(s, N);
}

main();

// node SleepSort1.js
