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

function rand() { return Math.floor(Math.random() * 2147483648); }

function shuffle(s, N) {
    let k, temp;

    for (let i = N - 1; i > 0; --i) {
        k = rand() % (i + 1);
        temp = s[i];
        s[i] = s[k];
        s[k] = temp;
    }
}

function bogoSort(s, N) {
    let count = 1;
    let swapped;

    while (true) {
        for (let k = 0; k < N; k++) {
            print(s[k] + " ");
        }
        print("Count=" + count++ + "\n");
        swapped = false;
        for (let i = 0; i < N - 1; i++) {
            if (s[i] > s[i + 1]) {
                swapped = true;
                break;
            }
        }
        if (!swapped) break;
        shuffle(s, N);
    }
}

function main() {
    const s = [4, 5, 2];
    const N = 3;
    // const s = [4, 5, 2, 9, 3];
    // const N = 5;
    // const s = [4, 5, 2, 7, 1, 9, 3];
    // const N = 7;
    // const s = [4, 5, 2, 8, 7, 1, 9, 3, 0];
    // const N = 9;
    // const s = [4, 5, 8, 2, 7, 1, 9, 0, 3, 10];
    // const N = 13;

    bogoSort(s, N);
    for (let k = 0; k < N; k++) {
        print(s[k] + " ");
    }
    print("\n");
}

main();
//	const s = [4, 5, 2, 8, 7, 10, 8, 1, 9, 3, 0, -1, -2];
//	const s = [4, 5, 2, 8, 7, 10, 8, 1, -10, -4, 9, 3, 0, 12, 0, 2, 100,-100,2];
