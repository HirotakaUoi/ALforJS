function sleepkSort(s, N) {
    for (let i = 0; i < N; ++i) {
        // setTimeoutでスレッドの代わりにタイマーを作成
        // （Node.jsはすべてのタイマーが終わるまでプロセスを終了しないので、
        //   C++のようなjoin（スレッドの終了待ち）は不要）
        setTimeout(() => {
            console.log(s[i]);
        }, s[i] * 1000);
    }
}

function main() {
    const s = [30, 9, 5, 15, 8, 6, 1];
    const N = 7;

    for (let k = 0; k < N; k++) {
        process.stdout.write(s[k] + " ");
    }
    process.stdout.write("\n");

    sleepkSort(s, N);
}

main();

// node SleepSort1.js
