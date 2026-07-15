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

function rand() { return Math.floor(Math.random() * 2147483648); }

// C++のclock()相当：マイクロ秒を返す（Node.js・ブラウザ両対応）
// Node.js: process.hrtime.bigint()（ナノ秒）を換算（μs精度）
// ブラウザ: performance.now()（ミリ秒）を換算（セキュリティ対策で精度は粗め）
const CLOCKS_PER_SEC = 1000000;
function clock() {
    if (isNode) return Number(process.hrtime.bigint() / 1000n);
    return Math.round(performance.now() * 1000);
}

function bubbleSort(s, N) {
    let temp;
    for (let i = 0; i < N - 1; i++)
        for (let j = 0; j < N - 1; j++)
            if (s[j] > s[j + 1]) {
                temp = s[j];
                s[j] = s[j + 1];
                s[j + 1] = temp;
            }
}

function selectionSort(s, N) {
    let min, temp;
    for (let i = 0; i < N - 1; i++) {
        //		for (let k=0; k<N; k++) {
        //			print(s[k] + " ");
        //		}
        //		print("\n");
        min = i;
        for (let j = i + 1; j < N; j++)
            if (s[min] > s[j]) min = j;
        temp = s[i];
        s[i] = s[min];
        s[min] = temp;
    }
}

function insertionSort(s, N) {
    let j, temp;
    for (let i = 0; i < N - 1; i++) {
        //		for (let k=0; k<N; k++) {
        //			print(s[k] + " ");
        //		}
        //		print("\n");
        j = i + 1;
        while ((j > 0) && (s[j - 1] > s[j])) {
            temp = s[j];
            s[j] = s[j - 1];
            s[j - 1] = temp;
            j--;
        }
    }
}

function shellSort(s, N) {
    let temp, i, j, h;

    h = 1;
    while (h < N) h = 3 * h + 1;
    h = Math.floor((h - 1) / 3);

    while (h > 0) {
        for (i = h; i < N; i++) {
            j = i;
            while ((j >= h) && (s[j - h] > s[j])) {
                temp = s[j];
                s[j] = s[j - h];
                s[j - h] = temp;
                j -= h;
            }
        }
        h = Math.floor((h - 1) / 3);
    }
}

function mergeSort(s, N) {
    let msize = 1, i, j, k, base1, base2;
    const b = [];	// JSの配列は自動拡張されるため大きさの指定は不要

    while (msize < N) {
        k = 0;
        base1 = 0;
        base2 = msize;
        while (base1 < N) {
            i = j = 0;
            while (true) {
                if ((i < msize) && (j < msize) && (base1 + i < N) &&
                    (base2 + j < N)) {
                    if (s[base1 + i] < s[base2 + j]) {
                        b[k] = s[base1 + i];
                        i++;
                        k++;
                    } else {
                        b[k] = s[base2 + j];
                        j++;
                        k++;
                    }
                } else if ((i < msize) && (base1 + i < N)) {
                    b[k] = s[base1 + i];
                    i++;
                    k++;
                } else if ((j < msize) && (base2 + j < N)) {
                    b[k] = s[base2 + j];
                    j++;
                    k++;
                } else {
                    break;
                }
            }
            base1 += 2 * msize;
            base2 += 2 * msize;
        }
        for (i = 0; i < N; i++) s[i] = b[i];
        //		for (let p=0; p<N; p++) {
        //			print(s[p] + " ");
        //		}
        //		print("msize= " + msize + "\n");
        // ================  0 =============
        msize *= 2;
    }
}

function swap(s, i, j) {
    const temp = s[i];
    s[i] = s[j];
    s[j] = temp;
}

function insertHeap(s, i) {
    while ((i > 0) && (s[i] > s[Math.floor((i - 1) / 2)])) {
        swap(s, i, Math.floor((i - 1) / 2));
        i = Math.floor((i - 1) / 2);
    }
}

function rebuildHeap(s, max) {
    let i = 0;

    while (true) {
        if (i * 2 + 2 < max) {
            if (s[i * 2 + 1] > s[i * 2 + 2]) {
                if (s[i * 2 + 1] > s[i]) {
                    swap(s, i, i * 2 + 1);
                    i = i * 2 + 1;
                } else {
                    break;
                }
            } else {
                if (s[i * 2 + 2] > s[i]) {
                    swap(s, i, i * 2 + 2);
                    i = i * 2 + 2;
                } else {
                    break;
                }
            }
        } else if (i * 2 + 1 < max) {
            if (s[i * 2 + 1] > s[i]) {
                swap(s, i, i * 2 + 1);
                i = i * 2 + 1;
            } else {
                break;
            }
        } else {
            break;
        }
    }
}

function heapSort(s, N) {
    let i;
    for (i = 1; i < N; i++) {
        insertHeap(s, i);
        //		for (let k=0; k<N; k++) {
        //			print(s[k] + " ");
        //		}
        //		print("\n");
    }

    for (i = 0; i < N - 1; i++) {
        swap(s, 0, N - 1 - i);
        rebuildHeap(s, N - 1 - i);
        //		for (let k=0; k<N; k++) {
        //			print(s[k] + " ");
        //		}
        //		print("\n");
    }
}

function qsort(s, first, last) {
    let pivot, i, j, temp;

    //		for (let k=first; k<=last; k++) {
    //			print(s[k] + " ");
    //		}
    //		print("first= " + first + " last= " + last + "\n");

    if (first < last) {
        pivot = s[last];
        //			print("Pivot=" + pivot + "\n");
        i = first;
        j = last - 1;
        while (true) {
            while ((i < last) && (s[i] < pivot)) {
                i += 1;
            }
            while ((j >= first) && (s[j] > pivot)) {
                j -= 1;
            }
            //			print("i= " + i + "j= " + j + "\n");
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

        //	for (let k=first; k<i; k++) {
        //		print(s[k] + " ");
        //	}
        //	print(" Pivot=" + s[i] + " ");
        //	for (let k=i+1; k<=last; k++) {
        //		print(s[k] + " ");
        //	}
        //	print("\n");

        qsort(s, first, i - 1);
        qsort(s, i + 1, last);
    }
}

function quickSort(s, N) { qsort(s, 0, N - 1); }

function combSort(s, N) {
    let temp;
    let h = Math.floor(N * 10 / 13);
    let swapped;

    while (true) {
        if (h === 9 || h === 10) h = 11;
        swapped = false;
        for (let i = 0; i + h < N; i++) {
            if (s[i] > s[i + h]) {
                temp = s[i + h];
                s[i + h] = s[i];
                s[i] = temp;
                swapped = true;
            }
        }
        if (h === 1) {
            if (!swapped) break;
        } else {
            h = Math.floor(h * 10 / 13);
        }
        // for (let k=0; k<N; k++) {
        //     print(s[k] + " ");
        // }
        // print("\n");
    }
}

function main() {
    const arraySize = parseInt(input("Input array size: "), 10);
    const s = [];
    const t = [];
    const u = [];
    const v = [];
    const w = [];
    const x = [];
    const y = [];
    const z = [];

    const N = arraySize;
    for (let i = 0; i < N; i++) {
        s[i] = t[i] = u[i] = v[i] = w[i] = x[i] = y[i] = z[i] =
            (rand() % 10000000);
    }
    //	for (let k=0; k<N; k++) {
    //		print(s[k] + " ");
    //	}
    //	print("\n");

    print("1/" + CLOCKS_PER_SEC + "sec unit\n");

    let startTime = clock();
    print("QuickSort Start:  " + startTime + "\n");
    quickSort(s, N);
    let endTime = clock();
    print("QuickSort End:    " + endTime + "\n");
    print("Processing Time = " + (endTime - startTime) + " μs\n\n");

    startTime = clock();
    print("CombSort Start: " + startTime + "\n");
    combSort(z, N);
    endTime = clock();
    print("CombSort End:   " + endTime + "\n");
    print("Processing Time = " + (endTime - startTime) + " μs\n\n");

    startTime = clock();
    print("HeapSort Start:   " + startTime + "\n");
    heapSort(t, N);
    endTime = clock();
    print("HeapSort End:     " + endTime + "\n");
    print("Processing Time = " + (endTime - startTime) + " μs\n\n");

    startTime = clock();
    print("MergeSort Start:  " + startTime + "\n");
    mergeSort(u, N);
    endTime = clock();
    print("MergeSort End:    " + endTime + "\n");
    print("Processing Time = " + (endTime - startTime) + " μs\n\n");

    startTime = clock();
    print("ShellSort Start:  " + startTime + "\n");
    shellSort(v, N);
    endTime = clock();
    print("ShellSort End:    " + endTime + "\n");
    print("Processing Time = " + (endTime - startTime) + " μs\n\n");

    // startTime = clock();
    // print("InsertionSort Start: " + startTime + "\n");
    // insertionSort(w, N);
    // endTime = clock();
    // print("InsertionSort End:   " + endTime + "\n");
    // print("Processing Time =    " + (endTime - startTime) + " μs\n\n");

    // startTime = clock();
    // print("SelectionSort Start: " + startTime + "\n");
    // selectionSort(x, N);
    // endTime = clock();
    // print("SelectionSort End:   " + endTime + "\n");
    // print("Processing Time =    " + (endTime - startTime) + " μs\n\n");

    // startTime = clock();
    // print("BubbleSort Start: " + startTime + "\n");
    // bubbleSort(y, N);
    // endTime = clock();
    // print("BubbleSort End:   " + endTime + "\n");
    // print("Processing Time = " + (endTime - startTime) + " μs\n\n");

    //	for (let k=0; k<N; k++) {
    //		print(s[k] + " ");
    //	}
    //	print("\n");
}

if (isNode) main();      // ブラウザでは「実行」ボタンから main() を呼ぶ
