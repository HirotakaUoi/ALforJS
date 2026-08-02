// ====== 共通の入出力機能（Node.js専用・readline使用）======
// print(s)  : C++の cout << 相当（改行なし出力）
// input(msg): C++の cin >> 相当（内部で readline の Promise を await して返す。呼び出し側は await input(...)）
const readline = require('readline/promises');

function print(s) {
    process.stdout.write(String(s));
}

async function input(msg) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const line = await rl.question(msg);
    rl.close();
    return line.trim();
}
// ==========================================

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

main();

//		const s = [4, 5, 2, 8, 7, 10, 8, 1, 9, 3, 0, -1, -2];
//	const s = [4, 5, 2, 8, 7, 10, 8, 1, -10, -4, 9, 3, 0, 12, 0, 2,
// 100,-100,2];
