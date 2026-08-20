// ====== 共通の入出力機能（変更しない）======
require("./io.js");
// ==========================================

function rand() { return Math.floor(Math.random() * 2147483648); }

function bubbleSort(s) {
    const N = s.length;
    let temp;
    for (let i = 0; i < N - 1; i++)
        for (let j = 0; j < N - 1; j++)
            if (s[j] > s[j + 1]) {
                temp = s[j];
                s[j] = s[j + 1];
                s[j + 1] = temp;
            }
}

function selectionSort(s) {
    const N = s.length;
    let min, temp;
    for (let i = 0; i < N - 1; i++) {
        //      for (let k=0; k<N; k++) {
        //          output(s[k] + " ");
        //      }
        //      output("\n");
        min = i;
        for (let j = i + 1; j < N; j++)
            if (s[min] > s[j]) min = j;
        temp = s[i];
        s[i] = s[min];
        s[min] = temp;
    }
}

function insertionSort(s) {
    const N = s.length;
    let j, temp;
    for (let i = 0; i < N - 1; i++) {
        //      for (let k=0; k<N; k++) {
        //          output(s[k] + " ");
        //      }
        //      output("\n");
        j = i + 1;
        while ((j > 0) && (s[j - 1] > s[j])) {
            temp = s[j];
            s[j] = s[j - 1];
            s[j - 1] = temp;
            j--;
        }
    }
}

function shellSort(s) {
    const N = s.length;
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

function mergeSort(s) {
    const N = s.length;
    let msize = 1, i, j, k, base1, base2;
    const b = [];   // JSの配列は自動拡張されるため大きさの指定は不要

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
        //      for (let p=0; p<N; p++) {
        //          output(s[p] + " ");
        //      }
        //      output("msize= " + msize + "\n");
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

function heapSort(s) {
    const N = s.length;
    let i;
    for (i = 1; i < N; i++) {
        insertHeap(s, i);
        //      for (let k=0; k<N; k++) {
        //          output(s[k] + " ");
        //      }
        //      output("\n");
    }

    for (i = 0; i < N - 1; i++) {
        swap(s, 0, N - 1 - i);
        rebuildHeap(s, N - 1 - i);
        //      for (let k=0; k<N; k++) {
        //          output(s[k] + " ");
        //      }
        //      output("\n");
    }
}

function qsort(s, first, last) {
    let pivot, i, j, temp;

    //      for (let k=first; k<=last; k++) {
    //          output(s[k] + " ");
    //      }
    //      output("first= " + first + " last= " + last + "\n");

    if (first < last) {
        pivot = s[last];
        //          output("Pivot=" + pivot + "\n");
        i = first;
        j = last - 1;
        while (true) {
            while ((i < last) && (s[i] < pivot)) {
                i += 1;
            }
            while ((j >= first) && (s[j] > pivot)) {
                j -= 1;
            }
            //          output("i= " + i + "j= " + j + "\n");
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

        //  for (let k=first; k<i; k++) {
        //      output(s[k] + " ");
        //  }
        //  output(" Pivot=" + s[i] + " ");
        //  for (let k=i+1; k<=last; k++) {
        //      output(s[k] + " ");
        //  }
        //  output("\n");

        qsort(s, first, i - 1);
        qsort(s, i + 1, last);
    }
}

function quickSort(s) {
    const N = s.length; qsort(s, 0, N - 1); }

function combSort(s) {
    const N = s.length;
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
        //     output(s[k] + " ");
        // }
        // output("\n");
    }
}

async function main() {
    const arraySize = parseInt(await input("Input array size: "), 10);
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
    //  for (let k=0; k<N; k++) {
    //      output(s[k] + " ");
    //  }
    //  output("\n");

    output("μs unit (performance.now)\n");

    let startTime = Math.round(performance.now() * 1000);
    output("QuickSort Start:  " + startTime + "\n");
    quickSort(s);
    let endTime = Math.round(performance.now() * 1000);
    output("QuickSort End:    " + endTime + "\n");
    output("Processing Time = " + (endTime - startTime) + " μs\n\n");

    startTime = Math.round(performance.now() * 1000);
    output("CombSort Start: " + startTime + "\n");
    combSort(z);
    endTime = Math.round(performance.now() * 1000);
    output("CombSort End:   " + endTime + "\n");
    output("Processing Time = " + (endTime - startTime) + " μs\n\n");

    startTime = Math.round(performance.now() * 1000);
    output("HeapSort Start:   " + startTime + "\n");
    heapSort(t);
    endTime = Math.round(performance.now() * 1000);
    output("HeapSort End:     " + endTime + "\n");
    output("Processing Time = " + (endTime - startTime) + " μs\n\n");

    startTime = Math.round(performance.now() * 1000);
    output("MergeSort Start:  " + startTime + "\n");
    mergeSort(u);
    endTime = Math.round(performance.now() * 1000);
    output("MergeSort End:    " + endTime + "\n");
    output("Processing Time = " + (endTime - startTime) + " μs\n\n");

    startTime = Math.round(performance.now() * 1000);
    output("ShellSort Start:  " + startTime + "\n");
    shellSort(v);
    endTime = Math.round(performance.now() * 1000);
    output("ShellSort End:    " + endTime + "\n");
    output("Processing Time = " + (endTime - startTime) + " μs\n\n");

    // startTime = Math.round(performance.now() * 1000);
    // output("InsertionSort Start: " + startTime + "\n");
    // insertionSort(w);
    // endTime = Math.round(performance.now() * 1000);
    // output("InsertionSort End:   " + endTime + "\n");
    // output("Processing Time =    " + (endTime - startTime) + " μs\n\n");

    // startTime = Math.round(performance.now() * 1000);
    // output("SelectionSort Start: " + startTime + "\n");
    // selectionSort(x);
    // endTime = Math.round(performance.now() * 1000);
    // output("SelectionSort End:   " + endTime + "\n");
    // output("Processing Time =    " + (endTime - startTime) + " μs\n\n");

    // startTime = Math.round(performance.now() * 1000);
    // output("BubbleSort Start: " + startTime + "\n");
    // bubbleSort(y);
    // endTime = Math.round(performance.now() * 1000);
    // output("BubbleSort End:   " + endTime + "\n");
    // output("Processing Time = " + (endTime - startTime) + " μs\n\n");

    //  for (let k=0; k<N; k++) {
    //      output(s[k] + " ");
    //  }
    //  output("\n");
}

main().finally(close);
