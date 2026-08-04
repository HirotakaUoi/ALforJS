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

function bsearch(dst, first, last, s, step) {
    for (let k = 0; k < 2 * step; k++)
        print(" ");
    print("First= " + first + " Last= " + last + "\n");
    if (first > last) return -1;
    const center = Math.floor((first + last) / 2);
    for (let k = 0; k < 2 * step; k++) print(" ");
    print("Center= " + center + "\n");

    if (dst === s[center]) {
        return center;
    } else if (dst < s[center]) {
        return bsearch(dst, first, center - 1, s, step + 1);
    } else {
        return bsearch(dst, center + 1, last, s, step + 1);
    }
}

async function main() {
    const s = [0, 1, 2, 4, 5, 7, 8, 9];
    const N = 8;
    const d = parseInt(await input("Input search number: "), 10);

    const res = bsearch(d, 0, N - 1, s, 0);
    if (res === -1) {
        print("I can't find: " + d + "\n");
    } else {
        print("Found: " + d + " at index " + res + "\n");
    }
}

main().finally(() => rl.close());
