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

function rand() {
  return Math.floor(Math.random() * 2147483648);
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

function main() {
  const arraySize = parseInt(input("Input array size: "), 10);
  const s = []; // JSの配列は自動拡張されるため大きさの指定は不要
  const N = arraySize;
  for (let i = 0; i < N; i++) {
    s[i] = rand() % 10000;
  }
  for (let k = 0; k < N - 1; k++) {
    print(s[k] + " ");
  }
  print("\n");

  bubbleSort(s, N);
  for (let k = 0; k < N; k++) {
    print(s[k] + " ");
  }
  print("\n");
}

main();
