//====== 環境判定と入出力の吸収層（Node.js・ブラウザ両対応）======
const isNode = typeof window === "undefined";

function print(s) {
  // cout << 相当（改行なし出力）
  if (isNode) {
    process.stdout.write(s);
  } else {
    document.getElementById("output").textContent += s;
  }
}

async function input(msg) {
  // cin >> 相当
  if (isNode) {
    const readline = await import("node:readline/promises");
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    const ans = await rl.question(msg);
    rl.close();
    return ans;
  } else {
    const ans = window.prompt(msg);
    print(msg + ans + "\n"); // 端末のエコーの代わりに出力欄にも残す
    return ans;
  }
}

// 時間計測：performance.now() は Node・ブラウザ両方で使える（ミリ秒・小数付き）
// マイクロ秒に換算して返す（C++のclock()相当）
// ※ブラウザではセキュリティ対策のため精度が粗くなる（環境により約5〜100μs刻み）
const CLOCKS_PER_SEC = 1000000;
function clock() {
  return Math.round(performance.now() * 1000);
}

function rand() {
  return Math.floor(Math.random() * 2147483648);
}
//==============================================================

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
    min = i;
    for (let j = i + 1; j < N; j++) if (s[min] > s[j]) min = j;
    temp = s[i];
    s[i] = s[min];
    s[min] = temp;
  }
}

function insertionSort(s, N) {
  let j, temp;
  for (let i = 0; i < N - 1; i++) {
    j = i + 1;
    while (j > 0 && s[j - 1] > s[j]) {
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
      while (j >= h && s[j - h] > s[j]) {
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
  let msize = 1,
    i,
    j,
    k,
    base1,
    base2;
  const b = [];

  while (msize < N) {
    k = 0;
    base1 = 0;
    base2 = msize;
    while (base1 < N) {
      i = j = 0;
      while (true) {
        if (i < msize && j < msize && base1 + i < N && base2 + j < N) {
          if (s[base1 + i] < s[base2 + j]) {
            b[k] = s[base1 + i];
            i++;
            k++;
          } else {
            b[k] = s[base2 + j];
            j++;
            k++;
          }
        } else if (i < msize && base1 + i < N) {
          b[k] = s[base1 + i];
          i++;
          k++;
        } else if (j < msize && base2 + j < N) {
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
    msize *= 2;
  }
}

function swap(s, i, j) {
  const temp = s[i];
  s[i] = s[j];
  s[j] = temp;
}

function insertHeap(s, i) {
  while (i > 0 && s[i] > s[Math.floor((i - 1) / 2)]) {
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
  }

  for (i = 0; i < N - 1; i++) {
    swap(s, 0, N - 1 - i);
    rebuildHeap(s, N - 1 - i);
  }
}

function qsort(s, first, last) {
  let pivot, i, j, temp;

  if (first < last) {
    pivot = s[last];
    i = first;
    j = last - 1;
    while (true) {
      while (i < last && s[i] < pivot) {
        i += 1;
      }
      while (j >= first && s[j] > pivot) {
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

    qsort(s, first, i - 1);
    qsort(s, i + 1, last);
  }
}

function quickSort(s, N) {
  qsort(s, 0, N - 1);
}

function combSort(s, N) {
  let temp;
  let h = Math.floor((N * 10) / 13);
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
      h = Math.floor((h * 10) / 13);
    }
  }
}

async function main() {
  const arraySize = parseInt(await input("Input array size: "), 10);
  const s = [];
  const t = [];
  const u = [];
  const v = [];
  const w = [];
  const z = [];

  const N = arraySize;
  for (let i = 0; i < N; i++) {
    s[i] = t[i] = u[i] = v[i] = w[i] = z[i] = rand() % 10000000;
  }

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

  startTime = clock();
  print("BubbleSort Start:  " + startTime + "\n");
  bubbleSort(w, N);
  endTime = clock();
  print("BubbleSort End:    " + endTime + "\n");
  print("Processing Time = " + (endTime - startTime) + " μs\n\n");
}

main();
