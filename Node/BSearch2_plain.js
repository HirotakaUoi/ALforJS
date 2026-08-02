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

function bsearch(dst, first, last, s, step) {
    if (first > last) return -1;
    const center = Math.floor((first + last) / 2);

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

main();
