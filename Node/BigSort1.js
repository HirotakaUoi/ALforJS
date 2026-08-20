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
        // for (let k=0; k<N; k++) {
        //  output(s[k] + " ");
        // }
        // output("\n");
        min = i;
        for (let j = i + 1; j < N; j++)
            if (s[min] > s[j])
                min = j;
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
    while (h < N)
        h = 3 * h + 1;
    h = Math.floor((h - 1) / 3);

    while (h > 0) {
//      output(h + " : ");
//      for (let x=0; x<N; x++) {
//          output(s[x] + " ");
//      }
//      output("\n");
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
    const N = s.length;
    qsort(s, 0, N - 1);
}

async function main() {
    const arraySize = parseInt(await input("Input array size: "), 10);
    const s = [];   // JSの配列は自動拡張されるため大きさの指定は不要
    const N = arraySize;
    // for (let i = 0; i < N; i++) {
    //  s[i] = (rand() % 1000000);
    // }
// //   for (let k=0; k<N; k++) {
// //       output(s[k] + " ");
// //   }
// //   output("\n");

    // output("BubbleSort Start!!\n");
    // bubbleSort(s);
    // output("BubbleSort End!!\n");
    // for (let k=0; k<N-1; k++) {
    //  output(s[k] + " ");
    // }
    // output("\n");
    // for (let i = 0; i < N; i++) {
    //  s[i] = (rand() % 1000000);
    // }
    // output("SelectionSort Start!!\n");
    // selectionSort(s);
    // output("SelectionSort End!!\n");

    // for (let i = 0; i < N; i++) {
    //  // s[i] = (rand() % 1000000);
    //  s[i] = 1000000-i;
    // }
    // output("InsertionSort Start!!\n");
    // insertionSort(s);
    // output("InsertionSort End!!\n");

    for (let i = 0; i < N; i++) {
        // s[i] = (rand() % 1000000);
        s[i] = 1000000 - i;

    }
    output("ShellSort Start!!\n");
    shellSort(s);
    output("ShellSort End!!\n");

    // for (let i = 0; i < N; i++) {
    //  s[i] = (rand() % 1000000);
    // }
    // output("QuickSort Start!!\n");
    // quickSort(s);
    // output("QuickSort End!!\n");
}

main().finally(close);
