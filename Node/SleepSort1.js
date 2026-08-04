// ====== 共通の入出力機能（Node.js専用・readline使用）======
// print(s)  : C++の cout << 相当（改行なし出力）
// input(msg): C++の cin >> 相当（readlineの非同期イテレータから1行受け取る。呼び出し側は await input(...)）
const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, terminal: false });
const _lines = rl[Symbol.asyncIterator]();

function print(s) {
    process.stdout.write(String(s));
}

async function input(msg) {
    print(msg);
    const { value } = await _lines.next();
    return (value ?? '').trim();
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

async function main() {
    const s = [30, 9, 5, 15, 8, 6, 1];
    const N = 7;

    for (let k = 0; k < N; k++) {
        print(s[k] + " ");
    }
    print("\n");

    sleepkSort(s, N);
}

main().finally(() => rl.close());

// node SleepSort1.js
