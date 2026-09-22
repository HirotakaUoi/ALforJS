// ====== 共通の入出力機能（変更しない）======
import { output, input } from "./io.js";
// ==========================================

function sleepSort(s) {
    const N = s.length;
    for (let i = 0; i < N; ++i) {
        // setTimeoutでスレッドの代わりにタイマーを作成
        // （Node.jsはすべてのタイマーが終わるまでプロセスを終了しないので、
        //   C++のようなjoin（スレッドの終了待ち）は不要）
        setTimeout(() => {
            output(s[i] + "\n");
        }, s[i] * 1000);
    }
}

function main() {
    const s = [30, 9, 5, 15, 8, 6, 1];

    for (const v of s) {
        output(v + " ");
    }
    output("\n");

    sleepSort(s);
}



// node SleepSort1.js

main();
