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

function bubbleSort(s, N) {
  let temp;
  for (let i = 0; i < N - 1; i++) {
    for (let k = 0; k < N; k++) {
      print(s[k] + " ");
    }
    print("\n");
    for (let j = 0; j < N - 1; j++)
      if (s[j] > s[j + 1]) {
        temp = s[j];
        s[j] = s[j + 1];
        s[j + 1] = temp;
      }
  }
}

function main() {
  const s = [4, 5, 2, 8, 7, 1, 9, 3, 0];
  const N = 9;
// const s = [4, 5, 2, 8, 7, 1];
// const N = 6;
// const s = [5, 4, 8, 2, 7, 0, 1];
// const N = 7;

  bubbleSort(s, N);
  for (let k = 0; k < N; k++) {
    print(s[k] + " ");
  }
  print("\n");
}

if (isNode) main();     // ブラウザでは「実行」ボタンから main() を呼ぶ

// const s = [4, 5, 2, 8, 7, 10, 8, 1, 9, 3, 0, -1, -2];
// const s = [4, 5, 2, 8, 7, 10, 8, 1, -10, -4, 9, 3, 0, 12, 0, 2,
// 100,-100,2];
