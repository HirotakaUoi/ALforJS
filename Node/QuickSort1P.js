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

// 配列の分割
function partition(arr, first, last) {
    const pivot = arr[last];
    let i = first - 1;

    for (let j = first; j < last; ++j) {
        if (arr[j] <= pivot) {
            ++i;
            const temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    const temp = arr[i + 1];
    arr[i + 1] = arr[last];
    arr[last] = temp;
    const pivotIndex = i + 1;

    // 分割結果を表示（ピボットを一度だけ表示）
    for (let k = first; k <= last; ++k) {
        if (k === pivotIndex) {
            print("Pivot=" + pivot + " ");
        } else {
            print(arr[k] + " ");
        }
    }
    print("\n");

    return pivotIndex;
}

// クイックソート（マルチスレッド版：JavaScriptでは非同期タスクで並行実行を再現）
async function parallelQuickSort(arr, first, last) {
    if (first < last) {
        const pi = partition(arr, first, last);

        // スレッドを格納する配列
        const threads = [];

        // 左側の部分配列を並列にソート
        threads.push((async () => {
            await parallelQuickSort(arr, first, pi - 1);
        })());

        // 右側の部分配列を並列にソート
        threads.push((async () => {
            await parallelQuickSort(arr, pi + 1, last);
        })());

        // すべてのスレッドの終了を待つ
        await Promise.all(threads);
    }
}

async function main() {
    const arr = [4, 5, 2, 8, 7, 10, 8, 1, -10, -4, 9, 3, 0, 12, 0, 2, 100, -100, 2];
    const n = arr.length;

    await parallelQuickSort(arr, 0, n - 1);

    print("Final sorted array: ");
    for (let i = 0; i < n; ++i)
        print(arr[i] + " ");
    print("\n");
}

main();
