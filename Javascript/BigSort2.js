// ====== 共通の入力機能（変更しない）======
// Node.js・ブラウザ両対応の同期入力（C++の cin >> 相当）
// Node.jsでは標準入力から1行だけ読み、ブラウザでは入力ダイアログを出す
const input = (typeof window !== 'undefined')
    ? (msg) => window.prompt(msg)
    : (msg) => {
        process.stdout.write(msg);
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
    };
// ========================================

function rand() { return Math.floor(Math.random() * 2147483648); }

// C++のclock()相当：process.hrtime.bigint()（ナノ秒）をマイクロ秒に変換して返す
const CLOCKS_PER_SEC = 1000000;
function clock() { return process.hrtime.bigint() / 1000n; }

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
        //			process.stdout.write(s[k] + " ");
        //		}
        //		process.stdout.write("\n");
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
        //			process.stdout.write(s[k] + " ");
        //		}
        //		process.stdout.write("\n");
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
        //			process.stdout.write(s[p] + " ");
        //		}
        //		process.stdout.write("msize= " + msize + "\n");
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
        //			process.stdout.write(s[k] + " ");
        //		}
        //		process.stdout.write("\n");
    }

    for (i = 0; i < N - 1; i++) {
        swap(s, 0, N - 1 - i);
        rebuildHeap(s, N - 1 - i);
        //		for (let k=0; k<N; k++) {
        //			process.stdout.write(s[k] + " ");
        //		}
        //		process.stdout.write("\n");
    }
}

function qsort(s, first, last) {
    let pivot, i, j, temp;

    //		for (let k=first; k<=last; k++) {
    //			process.stdout.write(s[k] + " ");
    //		}
    //		process.stdout.write("first= " + first + " last= " + last + "\n");

    if (first < last) {
        pivot = s[last];
        //			process.stdout.write("Pivot=" + pivot + "\n");
        i = first;
        j = last - 1;
        while (true) {
            while ((i < last) && (s[i] < pivot)) {
                i += 1;
            }
            while ((j >= first) && (s[j] > pivot)) {
                j -= 1;
            }
            //			process.stdout.write("i= " + i + "j= " + j + "\n");
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
        //		process.stdout.write(s[k] + " ");
        //	}
        //	process.stdout.write(" Pivot=" + s[i] + " ");
        //	for (let k=i+1; k<=last; k++) {
        //		process.stdout.write(s[k] + " ");
        //	}
        //	process.stdout.write("\n");

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
        //     process.stdout.write(s[k] + " ");
        // }
        // process.stdout.write("\n");
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
    //		process.stdout.write(s[k] + " ");
    //	}
    //	process.stdout.write("\n");

    process.stdout.write("1/" + CLOCKS_PER_SEC + "sec unit\n");

    let startTime = clock();
    process.stdout.write("QuickSort Start:  " + startTime + "\n");
    quickSort(s, N);
    let endTime = clock();
    process.stdout.write("QuickSort End:    " + endTime + "\n");
    process.stdout.write("Processing Time = " + (endTime - startTime) + " μs\n\n");

    startTime = clock();
    process.stdout.write("CombSort Start: " + startTime + "\n");
    combSort(z, N);
    endTime = clock();
    process.stdout.write("CombSort End:   " + endTime + "\n");
    process.stdout.write("Processing Time = " + (endTime - startTime) + " μs\n\n");

    startTime = clock();
    process.stdout.write("HeapSort Start:   " + startTime + "\n");
    heapSort(t, N);
    endTime = clock();
    process.stdout.write("HeapSort End:     " + endTime + "\n");
    process.stdout.write("Processing Time = " + (endTime - startTime) + " μs\n\n");

    startTime = clock();
    process.stdout.write("MergeSort Start:  " + startTime + "\n");
    mergeSort(u, N);
    endTime = clock();
    process.stdout.write("MergeSort End:    " + endTime + "\n");
    process.stdout.write("Processing Time = " + (endTime - startTime) + " μs\n\n");

    startTime = clock();
    process.stdout.write("ShellSort Start:  " + startTime + "\n");
    shellSort(v, N);
    endTime = clock();
    process.stdout.write("ShellSort End:    " + endTime + "\n");
    process.stdout.write("Processing Time = " + (endTime - startTime) + " μs\n\n");

    // startTime = clock();
    // process.stdout.write("InsertionSort Start: " + startTime + "\n");
    // insertionSort(w, N);
    // endTime = clock();
    // process.stdout.write("InsertionSort End:   " + endTime + "\n");
    // process.stdout.write("Processing Time =    " + (endTime - startTime) + " μs\n\n");

    // startTime = clock();
    // process.stdout.write("SelectionSort Start: " + startTime + "\n");
    // selectionSort(x, N);
    // endTime = clock();
    // process.stdout.write("SelectionSort End:   " + endTime + "\n");
    // process.stdout.write("Processing Time =    " + (endTime - startTime) + " μs\n\n");

    // startTime = clock();
    // process.stdout.write("BubbleSort Start: " + startTime + "\n");
    // bubbleSort(y, N);
    // endTime = clock();
    // process.stdout.write("BubbleSort End:   " + endTime + "\n");
    // process.stdout.write("Processing Time = " + (endTime - startTime) + " μs\n\n");

    //	for (let k=0; k<N; k++) {
    //		process.stdout.write(s[k] + " ");
    //	}
    //	process.stdout.write("\n");
}

main();
