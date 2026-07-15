// ====== 共通の入出力機能（変更しない）======
// Node.js・ブラウザ両対応の入出力
// print(s)  : C++の cout << 相当（改行なし出力）
// input(msg): C++の cin >> 相当（同期入力）
const isNode = typeof window === "undefined";

function print(s) {
  if (isNode) {
    process.stdout.write(String(s));
  } else {
    // appendChild(createTextNode) は追記のたびに全文をコピーしないため大量出力でも速い
    document
      .getElementById("output")
      .appendChild(document.createTextNode(String(s)));
  }
}

function input(msg) {
  if (isNode) {
    print(msg);
    const fs = require("fs");
    const buf = Buffer.alloc(1);
    const bytes = [];
    while (true) {
      let n;
      try {
        n = fs.readSync(0, buf, 0, 1); // 1バイトずつ読む
      } catch (e) {
        if (e.code === "EAGAIN") continue; // パイプでまだデータが来ていない間は待つ
        throw e;
      }
      if (n === 0) break; // EOF
      if (buf[0] === 10) break; // '\n' が来たら1行の終わり
      bytes.push(buf[0]);
    }
    return Buffer.from(bytes).toString("utf-8").trim();
  } else {
    // ページに入力欄（id="stdin"）があり値が入っていれば、そこから1行ずつ読む
    // （VSCode内蔵ブラウザなど prompt() のダイアログが出ない環境向け）
    const box = document.getElementById("stdin");
    if (box && box.value.trim() !== "") {
      if (!window._stdin)
        window._stdin = { lines: box.value.split("\n"), pos: 0 };
      const ans =
        window._stdin.pos < window._stdin.lines.length
          ? window._stdin.lines[window._stdin.pos++].trim()
          : "";
      print(msg + ans + "\n"); // 端末のエコーの代わりに出力欄にも残す
      return ans;
    }
    const ans = window.prompt(msg);
    print(msg + ans + "\n"); // 端末のエコーの代わりに出力欄にも残す
    return ans;
  }
}
// ==========================================

function rand() {
  return Math.floor(Math.random() * 2147483648);
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
      while (i < last && s[i] < pivot) {
        i += 1;
      }
      while (j >= first && s[j] > pivot) {
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

    for (let k = first; k < i; k++) {
      print(s[k] + " ");
    }
    print(" Pivot=" + s[i] + " ");
    for (let k = i + 1; k <= last; k++) {
      print(s[k] + " ");
    }
    print("\n");

    qsort(s, first, i - 1);
    qsort(s, i + 1, last);
  }
}

function quickSort(s, N) {
  qsort(s, 0, N - 1);
}

function search1(s, N, d) {
  for (let i = 0; i < N; i++) {
    if (d === s[i]) {
      print("Found: " + d + " at index " + i + "\n");
      return 0;
    }
  }
  print("I can't find: " + d + "\n");
  return 0;
}

function bsearch1(s, N, d) {
  let i, first, last, center;
  first = 0;
  last = N - 1;
  while (first <= last) {
    // 探索範囲が空でない間
    center = Math.floor((first + last) / 2); // 範囲の真ん中を計算
    if (d === s[center]) {
      // 範囲の真ん中の値がｄと等しい
      print("Found: " + d + " at index " + center + "\n");
      return 0;
    } else if (d < s[center]) {
      // 範囲の真ん中の値がｄより大きい
      last = center - 1; // 範囲の後半分を省く
    } else {
      // 範囲の真ん中の値がｄより小さい
      first = center + 1; // 範囲の前半分を省く
    }
  }
  print("I can't find: " + d + "\n");
  return 0;
}

function main() {
  const arraySize = parseInt(input("Input array size: "), 10);
  const s = []; // JSの配列は自動拡張されるため大きさの指定は不要
  const N = arraySize;
  for (let i = 0; i < N; i++) {
    s[i] = rand() % 100000;
  }
  quickSort(s, N);
  for (let k = 0; k < N - 1; k++) {
    print(s[k] + " ");
  }
  print("\n");

  const d = parseInt(input("Input search number: "), 10);

  search1(s, N, d);
  bsearch1(s, N, d);
}

if (isNode) main(); // ブラウザでは「実行」ボタンから main() を呼ぶ
