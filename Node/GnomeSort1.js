// ====== 共通の入出力機能（Node.js専用・readline使用）======
// print(s)  : C++の cout << 相当（改行なし出力）
// input(msg): C++の cin >> 相当（readlineの非同期イテレータから1行受け取る。呼び出し側は await input(...)）
const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, terminal: false });
const _lines = rl[Symbol.asyncIterator]();

function print(s) {
    process.stdout.write(String(s));
}

async function input(msg) {
    print(msg);
    const { value } = await _lines.next();
    return (value ?? '').trim();
}
// ==========================================

function gnomeSort(s, N) {
    let i = 0;
    while (i < N) {
        for (let k = 0; k < N; k++) {
            print(s[k] + " ");
        }
        print("\n");

        if (i === 0 || s[i - 1] <= s[i]) {
            i++;
        } else {
            const temp = s[i];
            s[i] = s[i - 1];
            s[i - 1] = temp;
            i--;
        }
    }
}

async function main() {
    // const s = [5, 4, 8, 2, 7, 0, 1];
    // const N = 7;
    const s = [4, 5, 2, 8, 7, 10, 8, 1, -10, -4, 9, 3, 0, 12, 0, 2, 100, -100, 2];
    const N = 19;

    gnomeSort(s, N);
    for (let k = 0; k < N; k++) {
        print(s[k] + " ");
    }
    print("\n");
}

main().finally(() => rl.close());
