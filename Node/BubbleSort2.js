// ====== 共通の入出力機能（変更しない）======
import { output, input } from "./io.js";
// ==========================================

function rand() { return Math.floor(Math.random() * 2147483648); }

function bubbleSort(s) {
  const N = s.length;
  for (let i = 0; i < N - 1; i++)
    for (let j = 0; j < N - 1; j++)
      if (s[j] > s[j + 1]) {
        [s[j], s[j + 1]] = [s[j + 1], s[j]];
      }
}

function main() {
  const arraySize = parseInt(input("Input array size: "));
  const s = [];     // JSの配列は自動拡張されるため大きさの指定は不要
  const N = arraySize;
  for (let i = 0; i < N; i++) {
    s[i] = rand() % 10000;
  }
  for (const v of s) {
    output(v + " ");
  }
  output("\n");

  bubbleSort(s);
  for (const v of s) {
    output(v + " ");
  }
  output("\n");
}

main();
