// ====== 共通の入出力機能（変更しない）======
require("./io.js");
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

async function main() {
  const arraySize = parseInt(await input("Input array size: "), 10);
  const s = [];     // JSの配列は自動拡張されるため大きさの指定は不要
  const N = arraySize;
  for (let i = 0; i < N; i++) {
    s[i] = rand() % 10000;
  }
  for (let k = 0; k < N - 1; k++) {
    output(s[k] + " ");
  }
  output("\n");

  bubbleSort(s, N);
  for (let k = 0; k < N; k++) {
    output(s[k] + " ");
  }
  output("\n");
}

main().finally(close);
