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

function stoogeSort(s, i, j) {
    if (s[i] > s[j]) {
        const temp = s[i];
        s[i] = s[j];
        s[j] = temp;
    }

    if (j - i + 1 > 2) {
        const t = Math.floor((j - i + 1) / 3);
        stoogeSort(s, i, j - t);
        stoogeSort(s, i + t, j);
        stoogeSort(s, i, j - t);
    }
}

function main() {
    const s = [5, 4, 8, 2, 7, 0, 1];
    const N = 7;

    for (let k = 0; k < N; k++) {
        print(s[k] + " ");
    }
    print("\n");

    stoogeSort(s, 0, N - 1);

    for (let k = 0; k < N; k++) {
        print(s[k] + " ");
    }
    print("\n");
}

main();
