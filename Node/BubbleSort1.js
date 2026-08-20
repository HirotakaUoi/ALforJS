// ====== 共通の入出力機能（変更しない）======
require("./io.js");
// ==========================================

function bubbleSort(s) {
  const N = s.length;
  let temp;
  for (let i = 0; i < N - 1; i++) {
    for (let k = 0; k < N; k++) {
      output(s[k] + " ");
    }
    output("\n");
    for (let j = 0; j < N - 1; j++)
      if (s[j] > s[j + 1]) {
        temp = s[j];
        s[j] = s[j + 1];
        s[j + 1] = temp;
      }
  }
}

async function main() {
  const s = [4, 5, 2, 8, 7, 1, 9, 3, 0];
  const N = s.length;
// const s = [4, 5, 2, 8, 7, 1];
// const N = 6;
// const s = [5, 4, 8, 2, 7, 0, 1];
// const N = 7;

  bubbleSort(s);
  for (let k = 0; k < N; k++) {
    output(s[k] + " ");
  }
  output("\n");
}



// const s = [4, 5, 2, 8, 7, 10, 8, 1, 9, 3, 0, -1, -2];
// const s = [4, 5, 2, 8, 7, 10, 8, 1, -10, -4, 9, 3, 0, 12, 0, 2,
// 100,-100,2];

main().finally(close);
