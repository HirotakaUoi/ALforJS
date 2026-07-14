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
            process.stdout.write("Pivot=" + pivot + " ");
        } else {
            process.stdout.write(arr[k] + " ");
        }
    }
    process.stdout.write("\n");

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

    process.stdout.write("Final sorted array: ");
    for (let i = 0; i < n; ++i)
        process.stdout.write(arr[i] + " ");
    process.stdout.write("\n");
}

main();
