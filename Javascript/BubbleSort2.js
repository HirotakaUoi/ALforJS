// ====== 共通の入出力機能 ======
const isNode = typeof window === "undefined";
const fs = isNode ? require("fs") : null;

function print(s) {
  if (isNode) process.stdout.write(String(s));
  else document.getElementById("output").append(String(s));
}

function input(msg) {
  if (isNode) {
    print(msg);
    const buf = Buffer.alloc(1);
    const bytes = [];
    while (fs.readSync(0, buf, 0, 1) && buf[0] !== 10) bytes.push(buf[0]);
    return Buffer.from(bytes).toString("utf-8").trim();
  }

  const box = document.getElementById("stdin");
  if (box && box.value.trim() !== "") {
    if (!window._stdin)
      window._stdin = { lines: box.value.split("\n"), pos: 0 };
    const ans = (window._stdin.lines[window._stdin.pos++] || "").trim();
    print(msg + ans + "\n");
    return ans;
  }

  const ans = window.prompt(msg);
  print(msg + ans + "\n");
  return ans;
}
// ==============================

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
  const s = [];     // JSの配列は自動拡張されるため大きさの指定は不要
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

if (isNode) main();     // ブラウザでは「実行」ボタンから main() を呼ぶ
