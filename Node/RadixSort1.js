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

function radixSort(s, N, max) {
    let i, j, k, n;

    // C++の vector<int> b[10] 相当：10個の空配列（配列リテラルで十分）
    const b = [[], [], [], [], [], [], [], [], [], []];

    for (n = 1; n < max; n *= 10) {
        for (i = 0; i < 10; i++) b[i].length = 0;

        for (i = 0; i < N; i++)
            b[Math.floor(s[i] / n) % 10].push(s[i]);

        for (k = 0; k < 10; k++) {
            print(k + ": ");
            for (i = 0; i < b[k].length; i++)
                print(String(b[k][i]).padStart(3, "0") + " ");
            print("\n");
        }
        k = 0;
        for (j = 0; j < 10; j++)
            for (i = 0; i < b[j].length; i++)
                s[k++] = b[j][i];
        for (k = 0; k < N; k++) {
            print(s[k] + " ");
        }
        print("\n");
    }
}

function main() {
    const s = [345, 98, 302, 719, 804, 620, 183, 431, 572];
    const N = 9;
    // const s = new Array(20);
    // const N = 20;
    // for (let i = 0; i < N; i++) {
    //     s[i] = (rand() % 1000);
    // }
    for (let k = 0; k < N; k++) {
        print(s[k] + " ");
    }
    print("\n");
    radixSort(s, N, 1000);
    for (let k = 0; k < N; k++) {
        print(s[k] + " ");
    }
    print("\n");
}

main();
