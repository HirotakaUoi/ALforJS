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

async function main() {
    const s = [3, 5, 2, 8, 7, 1, 9, 0, 10, 4];
    const N = 10;

    const d = parseInt(await input("Input: "), 10);

    for (let i = 0; i < N; i++) {
        if (d === s[i]) {
            print("Found at: " + i + "\n");
            return;
        }
    }
    print("I can't find\n");
}

main().finally(() => rl.close());
