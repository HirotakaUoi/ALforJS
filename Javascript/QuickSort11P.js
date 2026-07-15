// ====== 共通の入出力機能（変更しない）======
// Node.js・ブラウザ両対応の入出力
// print(s)  : C++の cout << 相当（改行なし出力）
// input(msg): C++の cin >> 相当（同期入力）
const isNode = (typeof window === 'undefined');

function print(s) {
    if (isNode) {
        process.stdout.write(String(s));
    } else {
        // appendChild(createTextNode) は追記のたびに全文をコピーしないため大量出力でも速い
        document.getElementById('output').appendChild(document.createTextNode(String(s)));
    }
}

function input(msg) {
    if (isNode) {
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
    } else {
        // ページに入力欄（id="stdin"）があり値が入っていれば、そこから1行ずつ読む
        // （VSCode内蔵ブラウザなど prompt() のダイアログが出ない環境向け）
        const box = document.getElementById('stdin');
        if (box && box.value.trim() !== '') {
            if (!window._stdin) window._stdin = { lines: box.value.split('\n'), pos: 0 };
            const ans = (window._stdin.pos < window._stdin.lines.length)
                ? window._stdin.lines[window._stdin.pos++].trim() : '';
            print(msg + ans + "\n");                // 端末のエコーの代わりに出力欄にも残す
            return ans;
        }
        const ans = window.prompt(msg);
        print(msg + ans + "\n");                    // 端末のエコーの代わりに出力欄にも残す
        return ans;
    }
}
// ==========================================

// 配列の分割
// function partition(arr, first, last) {
//     const pivot = arr[last];
//     let i = first - 1;
//
//     for (let j = first; j < last; ++j) {
//         if (arr[j] <= pivot) {
//             ++i;
//             [arr[i], arr[j]] = [arr[j], arr[i]];
//         }
//     }
//     [arr[i + 1], arr[last]] = [arr[last], arr[i + 1]];
//     const pivotIndex = i + 1;
//
//     // 分割結果を表示（ピボットを一度だけ表示）
//     for (let k = first; k <= last; ++k) {
//         if (k === pivotIndex) {
//             print("Pivot=" + pivot + " ");
//         } else {
//             print(arr[k] + " ");
//         }
//     }
//     print("\n");
//
//     return pivotIndex;
// }

// クイックソート（マルチスレッド版：JavaScriptでは非同期タスクで並行実行を再現）
async function parallelQuickSort(s, first, last) {
    let i, j, pivot, temp;

    if (first < last) {
        pivot = s[last];
        i = first;
        j = last - 1;
        while (true) {
            while ((i < last) && (s[i] < pivot)) {
                i += 1;
            }
            while ((j >= first) && (s[j] > pivot)) {
                j -= 1;
            }
            if (i >= j) {
                break;
            }
            temp = s[i];
            s[i] = s[j];
            s[j] = temp;
            i += 1;
            j -= 1;
        }
        temp = s[i];
        s[i] = s[last];
        s[last] = temp;
        // 分割結果を表示（ピボットを一度だけ表示）
        for (let k = first; k <= last; ++k) {
            if (k === i) {
                print("Pivot=" + pivot + " ");
            } else {
                print(s[k] + " ");
            }
        }
        print("\n");

        // スレッドを格納する配列
        const threads = [];

        // 左側の部分配列を並列にソート
        threads.push((async () => {
            await parallelQuickSort(s, first, i - 1);
        })());

        // 右側の部分配列を並列にソート
        threads.push((async () => {
            await parallelQuickSort(s, i + 1, last);
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

if (isNode) main();      // ブラウザでは「実行」ボタンから main() を呼ぶ
