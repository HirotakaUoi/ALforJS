// ====== 共通の入出力機能（変更しない）======
require("./io.js");
// ==========================================

function sleepkSort(s, N) {
    for (let i = 0; i < N; ++i) {
        // setTimeoutでスレッドの代わりにタイマーを作成
        // （Node.jsはすべてのタイマーが終わるまでプロセスを終了しないので、
        //   C++のようなjoin（スレッドの終了待ち）は不要）
        setTimeout(() => {
            output(s[i] + "\n");
        }, s[i] * 1000);
    }
}

async function main() {
    const s = [30, 9, 5, 15, 8, 6, 1];
    const N = 7;

    for (let k = 0; k < N; k++) {
        output(s[k] + " ");
    }
    output("\n");

    sleepkSort(s, N);
}



// node SleepSort1.js

main().finally(close);
